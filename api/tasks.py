# api/tasks.py
from celery import shared_task
from django.core.management import call_command
from celery.schedules import crontab
from backend.celery import app


@shared_task
def gfs_clear_task():
    call_command('gfs_clear')


@shared_task
def gfs_deploy_task():
    call_command('gfs_deploy')


@shared_task
def gfs_download_task():
    call_command('gfs_download')
    gfs_data_cleanup_task.apply_async(countdown=60)


@shared_task
def gfs_completion_task():
    call_command('gfs_completion')
    gfs_data_cleanup_task.apply_async(countdown=60)


@shared_task
def gfs_data_cleanup_task():
    call_command('gfs_data_cleanup')


@shared_task
def gfs_data_cleanup_tmp_task():
    call_command('gfs_data_cleanup_tmp')


@shared_task
def gfs_delete():
    call_command('gfs_delete')


app.conf.beat_schedule = {
    'clear': {
        'task': 'api.tasks.clear',
        'schedule': crontab(minute='52', hour='*'),
    },
    'deploy': {
        'task': 'api.tasks.deploy',
        'schedule': crontab(minute='50', hour='*'),
    },
    'gfs_completion': {
        'task': 'api.tasks.gfs_completion',
        'schedule': crontab(minute='30', hour='4'),
    },
    'gfs_data_cleanup': {
        'task': 'api.tasks.gfs_data_cleanup',
        'schedule': crontab(minute='54', hour='*'),
    },
    'gfs_data_cleanup_tmp': {
        'task': 'api.tasks.gfs_data_cleanup_tmp',
        'schedule': crontab(minute='56', hour='*'),
    },
    'gfs_delete': {
        'task': 'api.tasks.gfs_delete',
        'schedule': crontab(minute='5', hour='*'),
    },
    'gfs_download': {
        'task': 'api.tasks.gfs_download',
        'schedule': crontab(minute='1', hour='*'),
    },
}

app.conf.timezone = 'UTC'
