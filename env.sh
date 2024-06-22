#!/bin/bash

# Function to print usage
print_usage() {
    echo "Usage: $0 {development|production}"
}

# Prompt for environment if not provided
if [ $# -eq 0 ]; then
    echo "Please select the environment:"
    echo "1) Development"
    echo "2) Production"
    read -p "Enter your choice [1 or 2]: " choice
    case $choice in
        1)
            env="development"
            ;;
        2)
            env="production"
            ;;
        *)
            echo "Invalid choice"
            print_usage
            exit 1
            ;;
    esac
else
    env=$1
fi

# Check if the argument is valid
if [ "$env" != "development" ] && [ "$env" != "production" ]; then
    echo "Invalid environment specified."
    print_usage
    exit 1
fi

# Set the environment variable
export DJANGO_ENV=$env
echo "Environment set to $DJANGO_ENV"

# Source the environment variables from the appropriate file
env_file=".env.$DJANGO_ENV"
if [ -f $env_file ]; then
    echo "Loading environment variables from $env_file"
    set -o allexport
    source $env_file
    set +o allexport
else
    echo "Environment file $env_file not found"
    exit 1
fi

# If you want to run the Django server, uncomment the following line
# python manage.py runserver
