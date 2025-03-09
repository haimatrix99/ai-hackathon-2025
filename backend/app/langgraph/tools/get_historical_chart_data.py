from datetime import datetime
from typing import Literal

import httpx
from langchain_core.tools import ToolException, tool
from pydantic import BaseModel, Field


class CryptoName(BaseModel):
    crypto_name: str = Field(description="The crypto name in CoinGecko")
    days: int = Field(default=1, description="The data up to number of days ago")
    interval: Literal["", "5m", "hourly", "daily"] = Field(
        default="hourly",
        description="The data interval, leave empty for auto granularity",
    )


def process_data(data):
    # Process the data directly using list comprehension
    result = [
        {
            "datetime": datetime.fromtimestamp(row[0] / 1000).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "price": row[1],
        }
        for row in data
    ]

    return result


@tool("get-historical-chart-data", args_schema=CryptoName)
async def get_historical_chart_data(
    crypto_name: str, days: int = 1, interval: str = ""
):
    """Get historical chart data"""
    url = f"https://api.coingecko.com/api/v3/coins/{crypto_name.lower()}/market_chart?vs_currency=usd&days={days}&interval={interval}"
    async with httpx.AsyncClient(timeout=httpx.Timeout(timeout=10)) as client:
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            prices = data["prices"]
            result_dict = process_data(prices)
            return {"record": result_dict}
        else:
            raise ToolException("Error fetch historical chart data")
