import logging
from datetime import datetime, timezone
from django.core.management.base import BaseCommand
from weather.models import GFSForecast

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Delete old forecast data from the GFSForecast table'

    def handle(self, *args, **kwargs):
        # Get the current time in UTC
        current_time = datetime.now(timezone.utc)

        # Find records where the forecast date and hour have passed
        old_forecasts = GFSForecast.objects.filter(
            date__lte=current_time.date(),
            hour__lt=current_time.hour
        )

        # Delete the old forecasts
        count, _ = old_forecasts.delete()
        logger.info(f"Deleted {count} old forecast records.")

        self.stdout.write(self.style.SUCCESS(f'Successfully deleted {count} old forecast records.'))
