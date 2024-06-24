# Aethra Project

This is the Aethra project, a Django application with a React frontend.

## Table of Contents

- [Installation](#installation)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Nginx Configuration](#nginx-configuration)
- [Notes](#notes)

## Installation

### Prerequisites

- Python 3.12
- PostgreSQL
- Node.js and npm
- pipenv

### Steps

1. **Clone the repository:**

   ```sh
   git clone git@github.com:sellinios/aethra.git
   cd aethra

- pipenv shell
- pipenv install
- pipenv update
- sudo nano /etc/nginx/sites-available/frontend
- tree -L 7 -I 'node_modules|build'
- pip freeze > requirements.txt

psql -U sellinios -d aethradb
TRUNCATE TABLE geography_geographicdivision RESTART IDENTITY CASCADE;
