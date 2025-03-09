import os

import requests
from app.langgraph.prompt import SYSTEM_PROMPT_ADVISOR
from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

load_dotenv()

# Replace with your Etherscan API key
ETHERSCAN_API_KEY = os.getenv("ETHERSCAN_API_KEY")

WHALE_THRESHOLD = 100
# Exchange wallets (Binance, Coinbase, Kraken, etc.)
EXCHANGE_WALLETS = {
    "Binance": [
        "0x28C6c06298d514Db089934071355E5743bf21d60",
        "0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549",
    ],
    "Coinbase": [
        "0x503828976D22510aad0201ac7EC88293211D23Da",
    ],
    "Kraken": [
        "0x0A869d79a7052C7f1b55a8EbAbb06A34Df02A27b",
    ],
}


def get_latest_block():
    """Fetch the latest Ethereum block number."""
    url = f"https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey={ETHERSCAN_API_KEY}"
    response = requests.get(url).json()
    return int(response["result"], 16)


def calculate_past_block(latest_block, days_ago=7):
    """Estimate the block number from 'days_ago' days back."""
    blocks_per_day = (24 * 3600) // 12  # ~7,200 blocks per day
    return latest_block - (blocks_per_day * days_ago)


def get_recent_transactions(wallet, start_block, end_block):
    """Fetch ETH transactions for a specific wallet within the block range."""
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={wallet}&startblock={start_block}&endblock={end_block}&sort=desc&apikey={ETHERSCAN_API_KEY}"

    response = requests.get(url).json()
    return response["result"] if response["status"] == "1" else []


def analyze_whale_transactions(transactions, exchange, wallet):
    """Analyze whale transactions to count deposits & withdrawals."""
    deposits = 0
    withdrawals = 0
    total_deposit_amount = 0
    total_withdraw_amount = 0

    for tx in transactions:
        eth_amount = int(tx["value"]) / 10**18  # Convert Wei to ETH
        if eth_amount >= WHALE_THRESHOLD:
            if (
                tx["to"].lower() == wallet.lower()
            ):  # Deposit (whale sending ETH to exchange)
                deposits += 1
                total_deposit_amount += eth_amount
            elif (
                tx["from"].lower() == wallet.lower()
            ):  # Withdrawal (exchange sending ETH out)
                withdrawals += 1
                total_withdraw_amount += eth_amount

    return deposits, withdrawals, total_deposit_amount, total_withdraw_amount


def track_whales(token):
    if token == "eth":
        latest_block = get_latest_block()
        past_block = calculate_past_block(latest_block, 7)

        total_deposits = 0
        total_withdrawals = 0
        total_deposit_amount = 0
        total_withdraw_amount = 0

        for exchange, wallets in EXCHANGE_WALLETS.items():
            for wallet in wallets:
                transactions = get_recent_transactions(wallet, past_block, latest_block)
                deposits, withdrawals, deposit_amount, withdraw_amount = (
                    analyze_whale_transactions(transactions, exchange, wallet)
                )

                total_deposits += deposits
                total_withdrawals += withdrawals
                total_deposit_amount += deposit_amount
                total_withdraw_amount += withdraw_amount

        summary = (
            "\n📢 **Whale Transaction Summary (Last 7 Days)**:\n"
            f"🟢 Whale Deposits: {total_deposits} (Total: {total_deposit_amount:.2f} ETH)\n"
            f"🔴 Whale Withdrawals: {total_withdrawals} (Total: {total_withdraw_amount:.2f} ETH)\n"
            f"🚨 Total whale withdrawals in the last 7 days: {total_withdrawals}"
        )
        return summary
    else:
        return "There is no whales' transaction data"


def get_crypto_indicators(crypto_id="bitcoin", currency="usd"):
    base_url = "https://api.coingecko.com/api/v3"

    # Get market data (price, volume, high, low)
    market_data = requests.get(
        f"{base_url}/coins/markets", params={"vs_currency": currency, "ids": crypto_id}
    ).json()

    if not market_data:
        return {"error": "Invalid cryptocurrency ID or API issue"}

    data = market_data[0]

    # Extract basic indicators
    indicators = {
        "current_price": data["current_price"],
        "market_cap": data["market_cap"],
        "total_volume": data["total_volume"],
        "high_24h": data["high_24h"],
        "low_24h": data["low_24h"],
        "price_change_percentage_24h": data["price_change_percentage_24h"],
    }

    # Fetch historical prices and volumes for moving averages, RSI, and MACD calculations
    historical = requests.get(
        f"{base_url}/coins/{crypto_id}/market_chart",
        params={
            "vs_currency": currency,
            "days": "365",  # Fetch last 365 days of data for 200-day MA
            "interval": "daily",
        },
    ).json()

    if "prices" not in historical or "total_volumes" not in historical:
        return {"error": "Failed to fetch historical data"}

    # Convert historical data into a Pandas DataFrame
    prices = [x[1] for x in historical["prices"]]
    volumes = [x[1] for x in historical["total_volumes"]]
    df = pd.DataFrame({"Close": prices, "Volume": volumes})

    # Calculate Moving Averages
    df["SMA_50"] = df["Close"].rolling(window=50).mean()  # 50-day MA
    df["SMA_200"] = df["Close"].rolling(window=200).mean()  # 200-day MA
    df["EMA_10"] = df["Close"].ewm(span=10, adjust=False).mean()

    # Calculate RSI
    delta = df["Close"].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / loss
    df["RSI_14"] = 100 - (100 / (1 + rs))

    # Calculate MACD
    df["EMA_12"] = df["Close"].ewm(span=12, adjust=False).mean()
    df["EMA_26"] = df["Close"].ewm(span=26, adjust=False).mean()
    df["MACD"] = df["EMA_12"] - df["EMA_26"]
    df["MACD_Signal"] = df["MACD"].ewm(span=9, adjust=False).mean()

    # Calculate Support and Resistance Levels
    df["Support"] = df["Close"].rolling(window=20).min()  # Example: 20-day low
    df["Resistance"] = df["Close"].rolling(window=20).max()  # Example: 20-day high

    # Calculate 30-day average volume
    df["Volume_30d_Avg"] = df["Volume"].rolling(window=30).mean()

    # Get latest values
    latest_values = df.iloc[-1]
    indicators.update(
        {
            "SMA_50": latest_values["SMA_50"],
            "SMA_200": latest_values["SMA_200"],
            "EMA_10": latest_values["EMA_10"],
            "RSI_14": latest_values["RSI_14"],
            "MACD": latest_values["MACD"],
            "MACD_Signal": latest_values["MACD_Signal"],
            "Current_Volume": latest_values["Volume"],
            "Volume_30d_Avg": latest_values["Volume_30d_Avg"],
            "Support": latest_values["Support"],
            "Resistance": latest_values["Resistance"],
        }
    )

    return indicators


@tool("give-advisor")
async def give_advisor(crypto_name: str):
    """Give advisor"""
    report = get_crypto_indicators(crypto_id=crypto_name)
    transaction = track_whales(token=crypto_name)
    prompt = ChatPromptTemplate.from_template(template=SYSTEM_PROMPT_ADVISOR)

    model = ChatOpenAI(model="gpt-4o-mini", streaming=True)
    chain = prompt | model | StrOutputParser()
    response = await chain.ainvoke({"report": report, "transaction": transaction})
    return response
