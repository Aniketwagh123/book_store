from django.urls import path
from .views import CartView, CartItemView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('item/<int:book_id>/', CartItemView.as_view(), name='cart_item'),
]