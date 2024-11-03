from django.urls import path
from .views import RegisterUserView, LoginUserView, verify_registered_user
from .views import UserInfoView


urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register_user'),
    path('login/', LoginUserView.as_view(), name='login_user'),
    path('verify/<str:token>', verify_registered_user, name='verify_email'),
    path('user/', UserInfoView.as_view(), name='get_user_info'),

]
 