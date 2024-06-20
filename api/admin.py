from django.contrib import admin
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from django_celery_beat.admin import PeriodicTaskAdmin, CrontabScheduleAdmin

# Unregister the default admin registrations
admin.site.unregister(PeriodicTask)
admin.site.unregister(CrontabSchedule)

# Register with the default admin classes
admin.site.register(PeriodicTask, PeriodicTaskAdmin)
admin.site.register(CrontabSchedule, CrontabScheduleAdmin)
