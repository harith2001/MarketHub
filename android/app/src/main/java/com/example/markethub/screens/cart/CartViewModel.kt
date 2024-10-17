package com.example.markethub.screens.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.CartItem
import com.example.markethub.data.local.CartLocalDataSource
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderBasic
import com.example.markethub.domain.models.OrderItem
import com.example.markethub.domain.repository.OrderRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.Response
import javax.inject.Inject

@HiltViewModel
class CartViewModel @Inject constructor(
    private val cartLocalDataSource: CartLocalDataSource,
    private val orderRepository: OrderRepository,
    private val userLocalDataSource: UserLocalDataSource
) : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems

    private val _orderResponse = MutableStateFlow<Response<Order>?>(null)
    val orderResponse: StateFlow<Response<Order>?> = _orderResponse

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

    fun createOrder(cartItems: List<CartItem>, totalPrice: Double, note: String, shippingAddress: String) {
        val orderItems = cartItems.map { cartItem ->
            OrderItem(
                productId = cartItem.id,
                vendorId = cartItem.vendorId,
                productName = cartItem.name,
                quantity = cartItem.quantity,
                price = cartItem.price
            )
        }
        val orderBasic = OrderBasic(
            customerId = userLocalDataSource.getUser()?.userId ?: "",
            items = orderItems,
            totalPrice = totalPrice,
            note = note,
            shippingAddress = shippingAddress
        )

        viewModelScope.launch {
            val response = orderRepository.createOrder(orderBasic)
            _orderResponse.value = response
        }
    }

    fun clearOrderResponse() {
        _orderResponse.value = null
    }
}
