package com.example.markethub.screens.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.CartItem
import com.example.markethub.data.local.CartDataStore
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CartViewModel @Inject constructor(
    private val cartDataStore: CartDataStore
) : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems

    init {
        loadCartItems()
    }

    private fun loadCartItems() {
        viewModelScope.launch {
            _cartItems.value = cartDataStore.cartItems.first()
        }
    }

    fun addItem(cartItem: CartItem) {
        viewModelScope.launch {
            val updatedCart = _cartItems.value.toMutableList()
            val existingItemIndex = updatedCart.indexOfFirst { it.id == cartItem.id }

            if (existingItemIndex >= 0) {
                val existingItem = updatedCart[existingItemIndex]
                updatedCart[existingItemIndex] = existingItem.copy(quantity = existingItem.quantity + cartItem.quantity)
            } else {
                updatedCart.add(cartItem)
            }

            _cartItems.value = updatedCart
            cartDataStore.updateCartItems(updatedCart)
        }
    }

    fun updateQuantity(productId: String, newQuantity: Int) {
        viewModelScope.launch {
            val updatedCart = _cartItems.value.map {
                if (it.id == productId) it.copy(quantity = newQuantity) else it
            }

            _cartItems.value = updatedCart
            cartDataStore.updateCartItems(updatedCart)
        }
    }

    fun removeItem(productId: String) {
        viewModelScope.launch {
            val updatedCart = _cartItems.value.filter { it.id != productId }

            _cartItems.value = updatedCart
            cartDataStore.updateCartItems(updatedCart)
        }
    }
}


