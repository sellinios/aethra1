import os
from pathlib import Path
from environs import Env
from django.core.exceptions import ImproperlyConfigured

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = Env()
env.read_env()

# Read the environment variable DJANGO_ENV
environment = os.getenv('DJANGO_ENV', 'development')
env_file = BASE_DIR / f'.env.{environment}'

if os.path.exists(env_file):
    print(f"Loading environment variables from {env_file}")
    env.read_env(env_file)
else:
    raise ImproperlyConfigured(f"Environment file {env_file} does not exist")

# Basic settings
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=False)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=[])

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',
    'django.contrib.gis',
    'rest_framework_simplejwt.token_blacklist',
    'api',
    'weather',
    'users',
    'parler',
    'geography',
    'django_celery_beat',
    'django_celery_results',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': env('DATABASE_ENGINE'),
        'NAME': env('DATABASE_NAME_AETHRA'),
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST'),
        'PORT': env('DATABASE_PORT'),
    },
    'lagertha': {
        'ENGINE': env('DATABASE_ENGINE'),
        'NAME': env('DATABASE_NAME_LAGERTHA'),
        'USER': env('DATABASE_USER'),
        'PASSWORD': env('DATABASE_PASSWORD'),
        'HOST': env('DATABASE_HOST'),
        'PORT': env('DATABASE_PORT'),
    },
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'el'  # Set Greek as the default language
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'frontend' / 'kairos' / 'build' / 'static'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])

# Celery settings
CELERY_BROKER_URL = env('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND = env('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
CELERY_BROKER_CONNECTION_RETRY_ON_STARTUP = True

# Custom user model
AUTH_USER_MODEL = 'users.CustomUser'

# Simple JWT settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

# Translation settings
from django.utils.translation import gettext_lazy as _

LANGUAGES = [
    ('el', _('Greek')),
    ('en', _('English')),
    ('fr', _('French')),
    ('es', _('Spanish')),
    ('de', _('German')),
    ('it', _('Italian')),
    ('pt', _('Portuguese')),
    ('zh-hans', _('Simplified Chinese')),
    ('ja', _('Japanese')),
    ('ko', _('Korean')),
    ('ru', _('Russian')),
]

PARLER_LANGUAGES = {
    None: (
        {'code': 'el', 'fallbacks': ['en']},
        {'code': 'en', 'fallbacks': ['el']},
        {'code': 'fr', 'fallbacks': ['en']},
        {'code': 'es', 'fallbacks': ['en']},
        {'code': 'de', 'fallbacks': ['en']},
        {'code': 'it', 'fallbacks': ['en']},
        {'code': 'pt', 'fallbacks': ['en']},
        {'code': 'zh-hans', 'fallbacks': ['en']},
        {'code': 'ja', 'fallbacks': ['en']},
        {'code': 'ko', 'fallbacks': ['en']},
        {'code': 'ru', 'fallbacks': ['en']},
    ),
    'default': {
        'fallback': 'en',  # defaults to English
        'hide_untranslated': False,
    }
}
