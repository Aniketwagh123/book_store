from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import Group
from .models import User

@receiver(post_save, sender=User)
def create_default_groups(sender, **kwargs):
    # Ensure the 'seller' and 'buyer' groups are created
    Group.objects.get_or_create(name='seller')
    Group.objects.get_or_create(name='buyer')
