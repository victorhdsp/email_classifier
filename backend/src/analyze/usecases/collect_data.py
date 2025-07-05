
from src.analyze.models.analyze_result import AnalyzeFullResult
from src.semantic_cache.service import SemanticCacheService


class CollectDataUseCase:
    def __init__(
        self,
        semantic_cache_service: SemanticCacheService,
    ):
        self.semantic_cache = semantic_cache_service
        pass

    async def execute(self, result_id: str) -> AnalyzeFullResult | None:
        response_data = self.semantic_cache.get(result_id)

        if not response_data:
            return None

        result = AnalyzeFullResult(
            **response_data,
        )

        return result

