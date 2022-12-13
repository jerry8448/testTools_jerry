from django.urls import path

from . import views

urlpatterns = [
    path('/get/', views.get, name='get'),
    path('/post/',views.post, name='post'),
    path('/index/',views.index,name='index'),
    path('/stockMsg/',views.stock_msg,name='stockMsg'),
    path('/akstockMsg/',views.ak_stock_msg,name='akstockMsg'),
    path('/', views.test, name='test'),
    path('/save/', views.save, name='save'),
    path('/search/', views.search, name='search'),
    path('/send/', views.send, name='send'),
    path('/historys/', views.historys, name='historys')
]