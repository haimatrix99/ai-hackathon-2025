from typing import Any, Optional, cast

from app.langgraph.configuration import Configuration
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import InjectedToolArg, ToolException, tool
from pydantic import BaseModel, Field
from typing_extensions import Annotated


class SearchQuery(BaseModel):
    query: str = Field(description="The search query of user")


@tool("search")
async def search(
    query: str, *, config: Annotated[RunnableConfig, InjectedToolArg]
) -> Optional[list[dict[str, Any]]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is designed
    to provide comprehensive, accurate, and trusted results.
    """
    configuration = Configuration.from_runnable_config(config)
    wrapped = TavilySearchResults(max_results=configuration.max_search_results)
    try:
        result = await wrapped.ainvoke({"query": query})
        return cast(list[dict[str, Any]], result)
    except Exception:
        raise ToolException("Error search")
