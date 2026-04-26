import stripe
import os
from django.http import JsonResponse

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework_simplejwt.tokens import AccessToken
from .models import Property, Reservation, Review
from .serializers import PropertiesListSerializer, PropertiesDetailSerializer, ReservationsListSerializer, ReviewSerializer
from datetime import date

from .forms import PropertyForm
from useraccount.models import User


stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

@api_view(['POST'])
def create_payment_intent(request, pk):
    try:
        property = Property.objects.get(pk=pk)
        total_price = request.POST.get('total_price', '')

        intent = stripe.PaymentIntent.create(
            amount=int(float(total_price) * 100),  # Stripe uses cents
            currency='usd',
            metadata={
                'property_id': str(pk),
                'user_id': str(request.user.id)
            }
        )

        return JsonResponse({'clientSecret': intent.client_secret})
    except Exception as e:
        print('Stripe error:', e)
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def properties_list(request):
    #
    #
    # AUTH
    # 
    try:
        token = request.META['HTTP_AUTHORIZATION'].split('Bearer ')[1]
        token = AccessToken(token)
        user_id = token.payload['user_id']
        user = User.objects.get(pk=user_id)
    except Exception as e:
        user = None
    
    
    favorites = []
    properties = Property.objects.all()
    
    #
    # Filter
    
    is_favorites = request.GET.get('is_favorites', '')
    landlord_id = request.GET.get('landlord_id', '')
    country = request.GET.get('country', '')
    category = request.GET.get('category', '')
    checkin_date = request.GET.get('checkIn', '')
    checkout_date = request.GET.get('checkOut', '')
    bedrooms = request.GET.get('numBedrooms', '')
    guests = request.GET.get('numGuests', '')
    bathrooms = request.GET.get('numBathrooms', '')

    print('country', country)
    
    if checkin_date and checkout_date:
        exact_matches = Reservation.objects.filter(start_date=checkin_date) | Reservation.objects.filter(end_date=checkout_date)
        overlap_matches = Reservation.objects.filter(start_date__lte=checkout_date, end_date__gte=checkin_date)
        all_matches = []

        for reservation in exact_matches | overlap_matches:
            all_matches.append(reservation.property_id)
        
        properties = properties.exclude(id__in=all_matches)
    
    if landlord_id:
        properties = properties.filter(landlord_id=landlord_id)
        
    if is_favorites:
        properties = properties.filter(favorited__in=[user])
        
    if guests:
        properties = properties.filter(guests__gte=guests)
    
    if bedrooms:
        properties = properties.filter(bedrooms__gte=bedrooms)
    
    if bathrooms:
        properties = properties.filter(bathrooms__gte=bathrooms)
    
    if country:
        properties = properties.filter(country=country)
    
    if category and category != 'undefined':
        properties = properties.filter(category=category)
    
    #
    # favorites
    
    if user:
        for property in properties:
            if user in property.favorited.all():
                favorites.append(property.id)
    
    serializer = PropertiesListSerializer(properties, many=True)
    
    #
    #
    
    return JsonResponse({
        'data': serializer.data,
        'favorites': favorites
    })
    
    
@api_view(['GET'])
@authentication_classes([])
@permission_classes([])  
def properties_detail(request, pk):
    property = Property.objects.get(pk=pk)

    serializer = PropertiesDetailSerializer(property, many=False)

    return JsonResponse(serializer.data)

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_reservations(request, pk):
    property = Property.objects.get(pk=pk)
    reservations = property.reservations.all()

    serializer = ReservationsListSerializer(reservations, many=True)

    return JsonResponse(serializer.data, safe=False)


    
@api_view(['POST', 'FILES'])
def create_property(request):
    form = PropertyForm(request.POST, request.FILES)

    if form.is_valid():
        property = form.save(commit=False)
        property.landlord = request.user
        property.save()

        return JsonResponse({'success': True})
    else:
        print('error', form.errors, form.non_field_errors)
        return JsonResponse({'errors': form.errors.as_json()}, status=400)
    

@api_view(['POST'])
def book_property(request, pk):
    try:
        start_date = request.POST.get('start_date', '')
        end_date = request.POST.get('end_date', '')
        number_of_nights = request.POST.get('number_of_nights', '')
        total_price = request.POST.get('total_price', '')
        guests = request.POST.get('guests', '')

        property = Property.objects.get(pk=pk)

        Reservation.objects.create(
            property=property,
            start_date=start_date,
            end_date=end_date,
            number_of_nights=number_of_nights,
            total_price=total_price,
            guests=guests,
            created_by=request.user
        )

        return JsonResponse({'success': True})
    except Exception as e:
        print('Error', e)

        return JsonResponse({'success': False})
    

@api_view(['POST'])
def toggle_favorite(request, pk):
    property = Property.objects.get(pk=pk)

    if request.user in property.favorited.all():
        property.favorited.remove(request.user)

        return JsonResponse({'is_favorite': False})
    else:
        property.favorited.add(request.user)

        return JsonResponse({'is_favorite': True})
    

@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def property_reviews(request, pk):
    property = Property.objects.get(pk=pk)
    reviews = property.reviews.all().order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['POST'])
def add_review(request, pk):
    try:
        property = Property.objects.get(pk=pk)

        # Check if user is the landlord
        if property.landlord == request.user:
            return JsonResponse({'error': 'You cannot review your own property'}, status=400)

        # Check if user has a completed reservation
        completed_reservation = Reservation.objects.filter(
            property=property,
            created_by=request.user,
            end_date__lt=date.today()
        ).first()

        if not completed_reservation:
            return JsonResponse({'error': 'You can only review properties you have stayed at'}, status=400)

        # Check if already reviewed this reservation
        if hasattr(completed_reservation, 'review'):
            return JsonResponse({'error': 'You have already reviewed this stay'}, status=400)

        rating = request.POST.get('rating')
        comment = request.POST.get('comment')

        if not rating or not comment:
            return JsonResponse({'error': 'Rating and comment are required'}, status=400)

        review = Review.objects.create(
            property=property,
            created_by=request.user,
            reservation=completed_reservation,
            rating=int(rating),
            comment=comment
        )

        serializer = ReviewSerializer(review, many=False)
        return JsonResponse(serializer.data, safe=False)

    except Exception as e:
        print('Error', e)
        return JsonResponse({'error': str(e)}, status=400)


@api_view(['DELETE'])
def cancel_reservation(request, pk):
    try:
        reservation = Reservation.objects.get(pk=pk, created_by=request.user)
        reservation.delete()
        return JsonResponse({'success': True})
    except Reservation.DoesNotExist:
        return JsonResponse({'error': 'Reservation not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)