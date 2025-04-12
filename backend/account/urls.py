from django.urls import path

from account.views import SignInView,SignUpView, UserView

urlpatterns =[
    path('signin',SignInView.as_view()),
    path('signup',SignUpView.as_view()),
    path('me',UserView.as_view())
]