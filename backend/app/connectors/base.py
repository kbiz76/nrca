from abc import ABC, abstractmethod
from typing import Any, Dict, List
from datetime import datetime

class Connector(ABC):
    name: str

    def __init__(self, mode: str = "stub"):
        self.mode = mode
        self.last_pull: datetime | None = None

    @abstractmethod
    async def test_connection(self) -> Dict[str, Any]:
        ...

    @abstractmethod
    async def pull(self) -> List[Dict[str, Any]]:
        ...

