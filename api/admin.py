from django.contrib import admin
from django_celery_beat.models import PeriodicTask, CrontabSchedule
from django_celery_beat.admin import PeriodicTaskAdmin, CrontabScheduleAdmin
from api.models import ContactMessage

# Unregister the default admin registrations
admin.site.unregister(PeriodicTask)
admin.site.unregister(CrontabSchedule)

# Register with the default admin classes
admin.site.register(PeriodicTask, PeriodicTaskAdmin)
admin.site.register(CrontabSchedule, CrontabScheduleAdmin)

# Register the ContactMessage model
@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    search_fields = ('name', 'email', 'subject')
    readonly_fields = ('created_at',)
