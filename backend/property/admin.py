from django.contrib import admin
from .models import Property, Reservation, PropertyImage

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 3

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline]

admin.site.register(Reservation)