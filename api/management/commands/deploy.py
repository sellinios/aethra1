import os
import subprocess
from django.core.management.base import BaseCommand
import time
from environs import Env


class Command(BaseCommand):
    help = 'Deploy the application'

    def handle(self, *args, **kwargs):
        frontend_dirs = {
            'kairos': os.path.expanduser('/home/sellinios/aethra/frontend/kairos'),
            'fthina': os.path.expanduser('/home/sellinios/aethra/frontend/fthina'),
            'wfy24': os.path.expanduser('/home/sellinios/aethra/frontend/wfy24')
        }
        main_project_dir = os.path.expanduser('/home/sellinios/aethra')

        # Set the DJANGO_SETTINGS_MODULE environment variable to production
        os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'

        # Load the production environment variables using environs
        env = Env()
        env_file = os.path.join(main_project_dir, '.env.production')
        if os.path.exists(env_file):
            self.stdout.write(self.style.SUCCESS(f"Loading environment variables from {env_file}"))
            env.read_env(env_file)
        else:
            self.stdout.write(self.style.ERROR(f"Environment file {env_file} does not exist."))
            return

        # Update and upgrade system packages
        self.stdout.write(self.style.SUCCESS("Updating and upgrading system packages..."))
        max_retries = 10
        retry_interval = 5
        for attempt in range(max_retries):
            result = subprocess.run(["sudo", "apt", "update"], check=False)
            if result.returncode == 0:
                break
            elif result.returncode == 100:  # 'E: Could not get lock' error
                self.stdout.write(self.style.WARNING(
                    f"Attempt {attempt + 1}/{max_retries}: Waiting for the package manager lock to be released..."))
                time.sleep(retry_interval)
            else:
                self.stdout.write(self.style.ERROR("Failed to update system packages."))
                return
        else:
            self.stdout.write(self.style.ERROR("Exceeded maximum retries waiting for package manager lock. Exiting."))
            return

        result = subprocess.run(["sudo", "apt", "upgrade", "-y"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to upgrade system packages."))
            return

        self.stdout.write(self.style.SUCCESS("System packages updated and upgraded successfully."))

        # Build each frontend project
        for project_name, project_dir in frontend_dirs.items():
            self.stdout.write(self.style.SUCCESS(f"Checking frontend directory for {project_name}..."))
            if not os.path.isdir(project_dir):
                self.stdout.write(self.style.ERROR(f"Frontend directory {project_dir} does not exist. Skipping..."))
                continue

            self.stdout.write(self.style.SUCCESS(f"Running npm build for {project_name}..."))
            os.chdir(project_dir)
            result = subprocess.run(["npm", "run", "build"], check=False)
            if result.returncode != 0:
                self.stdout.write(
                    self.style.ERROR(f"Failed to build {project_name} with npm. Please check the error messages."))
                return

            self.stdout.write(self.style.SUCCESS(f"npm build successful for {project_name}."))

        self.stdout.write(self.style.SUCCESS("All npm builds successful. Preparing to manage Python dependencies..."))

        # Navigate back to the main project directory to run Django commands and handle Python dependencies
        os.chdir(main_project_dir)

        # Install Python dependencies using Pipenv
        self.stdout.write(self.style.SUCCESS("Installing Python dependencies with Pipenv..."))
        result = subprocess.run(["pipenv", "install"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to install Python dependencies. Please check the error messages."))
            return

        # Set DJANGO_ENV to production for manage.py commands
        os.environ['DJANGO_ENV'] = 'production'

        # Run migrations
        self.stdout.write(self.style.SUCCESS("Running manage.py migrate..."))
        result = subprocess.run(["pipenv", "run", "python", "manage.py", "migrate"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to run migrations. Please check the error messages."))
            return

        # Run manage.py collectstatic
        self.stdout.write(self.style.SUCCESS("Running manage.py collectstatic..."))
        result = subprocess.run(["pipenv", "run", "python", "manage.py", "collectstatic", "--noinput"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to collect static files. Please check the error messages."))
            return

        self.stdout.write(self.style.SUCCESS("Static files collected successfully. Restarting Gunicorn and Nginx..."))

        # Restart Gunicorn
        result = subprocess.run(["sudo", "systemctl", "restart", "gunicorn"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to restart Gunicorn. Please check the error messages."))
            return
        self.stdout.write(self.style.SUCCESS("Gunicorn restarted successfully."))

        # Restart Nginx
        result = subprocess.run(["sudo", "systemctl", "restart", "nginx"], check=False)
        if result.returncode != 0:
            self.stdout.write(self.style.ERROR("Failed to restart Nginx. Please check the error messages."))
            return
        self.stdout.write(self.style.SUCCESS("Nginx restarted successfully."))
