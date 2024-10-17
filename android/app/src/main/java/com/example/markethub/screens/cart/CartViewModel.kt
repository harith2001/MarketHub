package com.example.markethub.screens.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.CartItem
import com.example.markethub.data.local.CartLocalDataSource
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CartViewModel @Inject constructor(
    private val cartLocalDataSource: CartLocalDataSource
) : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems

    init {
        loadCartItems()
    }

    private fun loadCartItems() {
        viewModelScope.launch {
            _cartItems.value = cartLocalDataSource.getCartItems()
        }
    }

    fun addItem(cartItem: CartItem) {
        viewModelScope.launch {
            cartLocalDataSource.addOrUpdateCartItem(cartItem)
            loadCartItems()
        }
    }

    fun updateQuantity(productId: String, newQuantity: Int) {
        viewModelScope.launch {
            cartLocalDataSource.updateCartItemQuantity(productId, newQuantity)
            loadCartItems()
        }
    }

    fun removeItem(productId: String) {
        viewModelScope.launch {
            cartLocalDataSource.removeCartItem(productId)
            loadCartItems()
        }
    }
}
