import httpx
from langchain_core.tools import ToolException, tool


@tool("get-trending-coin")
async def get_trending_coin():
    """Get trending coin"""
    url = "https://api.coingecko.com/api/v3/search/trending"
    async with httpx.AsyncClient(timeout=httpx.Timeout(timeout=10)) as client:
        response = await client.get(url)
        if response.status_code == 200:
            data = response.json()
            coins = data["coins"]
            list_trending_coin = []
            for coin in coins:
                list_trending_coin.append(coin["item"]["id"])
            return list_trending_coin
        else:
            raise ToolException("Error fetch trending coin")
