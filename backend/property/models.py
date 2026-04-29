import uuid

from django.conf import settings
from django.db import models

from useraccount.models import User

class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_per_night = models.IntegerField()
    bedrooms = models.IntegerField()
    bathrooms = models.IntegerField()
    guests = models.IntegerField()
    country = models.CharField(max_length=255)
    country_code = models.CharField(max_length=10)
    category = models.CharField(max_length=255)
    favorited = models.ManyToManyField(User, related_name='favorites', blank=True)
    image = models.ImageField(upload_to='uploads/properties')
    landlord = models.ForeignKey(User, related_name='properties', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title 
    
    def image_url(self):
        if self.image:
            import os
            cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
            image_path = str(self.image)
            # Add extension again since Cloudinary doubles it
            ext = os.path.splitext(image_path)[1]
            return f'https://res.cloudinary.com/{cloud_name}/image/upload/{image_path}{ext}'
        return ''
    
    

class Reservation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_nights = models.IntegerField()
    guests = models.IntegerField()
    total_price = models.FloatField()
    created_by = models.ForeignKey(User, related_name='reservations', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f'{self.property.title} | {self.start_date} to {self.end_date} | {self.created_by}'
    
    
class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='reviews', on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    reservation = models.OneToOneField(Reservation, related_name='review', on_delete=models.CASCADE)
    rating = models.IntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.property.title} | {self.created_by.name} | {self.rating}⭐'
    
    
    
class PropertyImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    property = models.ForeignKey(Property, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/properties')
    order = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.property.title} - image {self.order}'

    def image_url(self):
        if self.image:
            import os
            cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
            image_path = str(self.image)
            # Add extension again since Cloudinary doubles it
            ext = os.path.splitext(image_path)[1]
            return f'https://res.cloudinary.com/{cloud_name}/image/upload/{image_path}{ext}'
        return ''