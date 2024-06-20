import os
import shutil
import subprocess
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Manage migrations for custom apps'

    def handle(self, *args, **kwargs):
        custom_apps = ["api", "articles", "geography", "weather"]
        builtin_apps = ["admin", "auth", "contenttypes", "sessions"]

        self.stdout.write(self.style.SUCCESS("Removing existing migrations for custom apps..."))

        for app in custom_apps:
            migrations_dir = os.path.join(app, "migrations")
            if os.path.exists(migrations_dir):
                shutil.rmtree(migrations_dir)
                os.makedirs(migrations_dir)
                with open(os.path.join(migrations_dir, "__init__.py"), 'w'):
                    pass
                self.stdout.write(self.style.SUCCESS(f"Cleaned migrations for {app}."))
            else:
                self.stdout.write(self.style.WARNING(f"Migrations directory for app {app} does not exist."))

        # Create migrations for geography
        self.stdout.write(self.style.SUCCESS("Creating new initial migrations for geography..."))
        if subprocess.call(["python", "manage.py", "makemigrations", "geography"]) != 0:
            self.stdout.write(self.style.ERROR("Failed to create migrations for geography."))
            return

        # Create migrations for weather
        self.stdout.write(self.style.SUCCESS("Creating new initial migrations for weather..."))
        if subprocess.call(["python", "manage.py", "makemigrations", "weather"]) != 0:
            self.stdout.write(self.style.ERROR("Failed to create migrations for weather."))
            return

        # Apply all migrations
        self.stdout.write(self.style.SUCCESS("Applying migrations..."))
        if subprocess.call(["python", "manage.py", "migrate"]) != 0:
            self.stdout.write(self.style.ERROR("Failed to apply migrations."))
            return

        self.stdout.write(self.style.SUCCESS("Migrations applied successfully."))
