

from src.analyze.models.analyze_result import AnalyzeFullResult
from src.shared.services.semantic_cache import SemanticCacheService
from src.shared.utils.logger import get_logger

logger = get_logger(__name__)


class CollectDataUseCase:
    def __init__(
        self,
        semantic_cache_service: SemanticCacheService,
    ):
        self.semantic_cache = semantic_cache_service
        logger.info("CollectDataUseCase initialized.")

    async def execute(self, user_token: str, result_id: str) -> AnalyzeFullResult | None:
        logger.info(f"Executing CollectDataUseCase for user {user_token} and result ID {result_id}.")
        response_data = self.semantic_cache.verify_and_get(user_token, result_id)

        if not response_data:
            logger.info(f"No data found for result ID {result_id} and user {user_token}.")
            return None

        result = AnalyzeFullResult(
            **response_data,
        )
        logger.info(f"Data collected successfully for result ID {result_id}.")
        return result

