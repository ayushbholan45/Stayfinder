from django.http import JsonResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from .models import User
from .serializers import UserDetailSerializer, ProfileSerializer
from property.serializers import ReservationsListSerializer
from property.models import Reservation

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def landlord_detail(request, pk):
    user = User.objects.get(pk=pk)
    serializer = UserDetailSerializer(user, many=False)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def reservations_list(request):
    reservations = request.user.reservations.all()
    serializer = ReservationsListSerializer(reservations, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['DELETE'])
def cancel_reservation(request, pk):
    reservation = Reservation.objects.get(pk=pk, created_by=request.user)
    reservation.delete()
    return JsonResponse({'success': True})

@api_view(['GET'])
def profile_detail(request):
    serializer = ProfileSerializer(request.user, many=False)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def profile_update(request):
    user = request.user
    user.name = request.POST.get('name', user.name)
    user.bio = request.POST.get('bio', user.bio)

    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']

    user.save()

    serializer = ProfileSerializer(user, many=False)
    return JsonResponse(serializer.data, safe=False)