import httpx
from langchain_core.tools import ToolException, tool
from pydantic import BaseModel, Field


class CryptoPrice(BaseModel):
    crypto_name: str = Field(description="The crypto name in CoinGecko")


@tool("get-crypto-price", args_schema=CryptoPrice)
async def get_crypto_price(crypto_name: str = "bitcoin"):
    """Get crypto price"""
    url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto_name.lower()}&vs_currencies=usd"
    async with httpx.AsyncClient(timeout=httpx.Timeout(timeout=10)) as client:
        response = await client.get(url)
        print(response.json())
        if response.status_code == 200:
            data = response.json()
            price = data[crypto_name.lower()]["usd"]
            return f"{price} USD"
        else:
            raise ToolException("Error fetch crypto price")
