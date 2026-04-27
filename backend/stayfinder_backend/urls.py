from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/properties/', include('property.urls')),
    
    # Auth endpoints
    path('api/auth/', include('useraccount.urls')),
    path('api/auth/login/', include('dj_rest_auth.urls')), # For login/logout
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')), # For signup
    
    path('api/chat/', include('chat.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)