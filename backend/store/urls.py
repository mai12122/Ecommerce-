from django.urls import path
from . import views

urlpatterns = [ 
    path('products/', views.get_products, name='get_products'),
    path('products/<int:pk>/', views.get_product, name='get_product'),
    path('categories/', views.get_categories, name='get_categories'),
    path('cart/', views.get_cart, name='get_cart'),
    path('cart/<int:pk>/', views.get_cart, name='get_cart_with_pk'),
    path('cart/add/', views.add_to_cart, name='add_to_cart'),
    path('cart/remove/', views.remove_from_cart, name='remove_from_cart'),
    path('cart/update/', views.update_cart_quantity, name='update_cart_quantity'),
    path('orders/create/', views.create_orders, name='create_orders'),
    path('orders/', views.get_orders, name='get_orders'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/signin/', views.signin, name='signin'),
    path('auth/profile/', views.update_profile, name='update_profile'),
]
