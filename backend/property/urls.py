from django.urls import path
from . import api

urlpatterns = [
    path('', api.properties_list, name='api_properties_list'),
    path('create/', api.create_property, name='api_create_property'),
    path('<uuid:pk>/', api.properties_detail, name='api_properties_detail'),
    path('<uuid:pk>/book/', api.book_property, name='api_book_property'),
    path('<uuid:pk>/reservations/', api.property_reservations, name='api_property_reservations'),
    path('<uuid:pk>/toggle_favorite/', api.toggle_favorite, name='api_toggle_favorite'),
    path('<uuid:pk>/create_payment_intent/', api.create_payment_intent, name='api_create_payment_intent'), 
    path('<uuid:pk>/reviews/', api.property_reviews, name='api_property_reviews'),
    path('<uuid:pk>/reviews/add/', api.add_review, name='api_add_review'),
    path('reservations/<uuid:pk>/cancel/', api.cancel_reservation, name='api_cancel_reservation'),
    path('<uuid:pk>/images/', api.add_property_images, name='api_add_property_images'),
     
]