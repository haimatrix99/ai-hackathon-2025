from app.langgraph.prompt import SYSTEM_PROMPT
from app.langgraph.state import AgentState
from app.langgraph.tools.buy_coin import buy_coin
from app.langgraph.tools.get_crypto_price import get_crypto_price
from app.langgraph.tools.get_historical_chart_data import get_historical_chart_data
from app.langgraph.tools.get_trending_coin import get_trending_coin
from app.langgraph.tools.give_advisor import give_advisor
from app.langgraph.tools.search import search
from dotenv import load_dotenv
from langchain_core.messages import SystemMessage
from langchain_core.tools import BaseTool
from langchain_openai import ChatOpenAI
from langgraph.errors import NodeInterrupt
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode
from pydantic import BaseModel

load_dotenv()


model = ChatOpenAI(model="gpt-4o-mini", streaming=True)
tools = [
    get_crypto_price,
    get_trending_coin,
    get_historical_chart_data,
    buy_coin,
    give_advisor,
    search,
]


def should_continue(state):
    messages = state["messages"]
    last_message = messages[-1]
    if not last_message.tool_calls:
        return END
    else:
        return "tools"


class AnyArgsSchema(BaseModel):
    # By not defining any fields and allowing extras,
    # this schema will accept any input passed in.
    class Config:
        extra = "allow"


class FrontendTool(BaseTool):
    def __init__(self, name: str):
        super().__init__(name=name, description="", args_schema=AnyArgsSchema)

    def _run(self, *args, **kwargs):
        # Since this is a frontend-only tool, it might not actually execute anything.
        # Raise an interrupt or handle accordingly.
        raise NodeInterrupt("This is a frontend tool call")

    async def _arun(self, *args, **kwargs) -> str:
        # Similarly handle async calls
        raise NodeInterrupt("This is a frontend tool call")


def get_tool_defs(config):
    frontend_tools = [
        {"type": "function", "function": tool}
        for tool in config["configurable"]["frontend_tools"]
    ]
    return tools + frontend_tools


def get_tools(config):
    frontend_tools = [
        FrontendTool(tool.name) for tool in config["configurable"]["frontend_tools"]
    ]
    return tools + frontend_tools


async def call_model(state, config):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]
    model_with_tools = model.bind_tools(get_tool_defs(config))
    response = await model_with_tools.ainvoke(messages)
    # We return a list, because this will get added to the existing list
    return {"messages": response}


async def run_tools(input, config, **kwargs):
    tool_node = ToolNode(get_tools(config))
    return await tool_node.ainvoke(input, config, **kwargs)


# Define a new graph
workflow = StateGraph(AgentState)

workflow.add_node("agent", call_model)
workflow.add_node("tools", run_tools)


workflow.set_entry_point("agent")
workflow.add_conditional_edges(
    "agent",
    should_continue,
    ["tools", END],
)

workflow.add_edge("tools", "agent")

assistant_ui_graph = workflow.compile()
