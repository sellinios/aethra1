#!/bin/bash

# Navigate to the parent directory of `aethra`
cd ~

# Create a backup directory with the current date
backup_dir="aethra_backup_$(date +%Y%m%d)"
cp -rp aethra "$backup_dir"

# Check if the backup was successful
if [ -d "$backup_dir" ]; then
  echo "Backup created successfully at $backup_dir"
else
  echo "Backup failed"
  exit 1
fi

# Restart Gunicorn and Nginx
sudo systemctl restart gunicorn
if [ $? -eq 0 ]; then
  echo "Gunicorn restarted successfully."
else
  echo "Failed to restart Gunicorn."
  exit 1
fi

sudo systemctl restart nginx
if [ $? -eq 0 ]; then
  echo "Nginx restarted successfully."
else
  echo "Failed to restart Nginx."
  exit 1
fi
