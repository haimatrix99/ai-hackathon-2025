# AI Hackathon 2025

## Deployment

Agent is publicly accessible through two interfaces:

1. API:
   > The Cloud API for the agent is publicly accessible at the following base URL: `https://ai-hackathon-2025.vercel.app`

2. Web-based Chat Interface:
   > To go along with the API, we've also deployed this web-based chat interface for agent.
   >
   > You can access, and interact with it [here](https://ai-hackathon-2025.vercel.app).

## Setup

To setup, install dependencies from the root of the monorepo:

```bash
npm install
```

This will install all dependencies required by both the frontend and backend projects. You can also run shared commands from the root of the project:

```bash
npm run build

npm start
```

## Environment variables

### Backend

The backend requires Tavily and OpenAI API keys to run. Sign up here:

- Tavily: https://tavily.com/
- OpenAI: https://platform.openai.com/signup
- Etherscan: 

Once you have your API keys, create a `.env` file in the [`./backend`](`./backend`) directory and add the following:

```bash
TAVILY_API_KEY=YOUR_API_KEY
OPENAI_API_KEY=YOUR_API_KEY
ETHERSCAN_API_KEY=YOUR_API_KEY

```

### Frontend


Set the variables in a `.env` file inside [`./frontend`](./frontend):

```bash
NEXT_PUBLIC_API_URL="http://localhost:8080"
```
