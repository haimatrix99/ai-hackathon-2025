"""Define the configurable parameters for the agent."""

from __future__ import annotations

from dataclasses import dataclass, field, fields
from typing import Optional

from langchain_core.runnables import RunnableConfig, ensure_config
from typing_extensions import Literal


@dataclass(kw_only=True)
class Configuration:
    """The configuration for the agent."""

    model: Literal[
        "openai/gpt-4o",
        "openai/gpt-4o-mini",
        "anthropic/claude-3-7-sonnet-20250219",
        "google_genai/gemini-2.0-flash",
    ] = field(default="openai/gpt-4o-mini")
    max_search_results: int = field(default=10)

    @classmethod
    def from_runnable_config(
        cls, config: Optional[RunnableConfig] = None
    ) -> Configuration:
        """Create a Configuration instance from a RunnableConfig object."""
        config = ensure_config(config)
        configurable = config.get("configurable") or {}
        _fields = {f.name for f in fields(cls) if f.init}
        return cls(**{k: v for k, v in configurable.items() if k in _fields})
