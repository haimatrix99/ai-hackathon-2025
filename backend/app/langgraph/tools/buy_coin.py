from typing import Literal, Optional

from langchain_core.tools import tool
from langgraph.errors import NodeInterrupt


@tool("buy-coin")
async def buy_coin(
    fiat_amount: Optional[float] = None,
    fiat_currency: Optional[Literal["VND", "USD"]] = None,
    coin: Optional[str] = None,
    wallet_address: Optional[str] = None,
):
    """Buy coin"""
    raise NodeInterrupt(
        "Please confirm all information must be filled before order buy coin."
    )
