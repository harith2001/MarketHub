package com.example.markethub.screens.cart

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.CartItem
import com.example.markethub.data.local.CartLocalDataSource
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.domain.models.CreateOrderResponse
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderBasic
import com.example.markethub.domain.models.OrderItem
import com.example.markethub.domain.models.Payment
import com.example.markethub.domain.repository.OrderRepository
import com.example.markethub.domain.repository.PaymentRepository
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
    private val userLocalDataSource: UserLocalDataSource,
    private val paymentRepository: PaymentRepository
) : ViewModel() {

    private val _cartItems = MutableStateFlow<List<CartItem>>(emptyList())
    val cartItems: StateFlow<List<CartItem>> = _cartItems

    private val _cartItemsCount = MutableStateFlow(0)
    val cartItemsCount: StateFlow<Int> = _cartItemsCount

    private val _orderResponse = MutableStateFlow<Response<CreateOrderResponse>?>(null)
    val orderResponse: StateFlow<Response<CreateOrderResponse>?> = _orderResponse

    init {
        loadCartItems()
    }

    fun loadCartItems() {
        viewModelScope.launch {
            _cartItems.value = cartLocalDataSource.getCartItems()
            _cartItemsCount.value = _cartItems.value.size
        }
    }

    fun addItem(cartItem: CartItem) {
        viewModelScope.launch {
            cartLocalDataSource.addOrUpdateCartItem(cartItem)
            loadCartItems()
        }
    }

    fun clearCartAndAddItem(cartItem: CartItem) {
        viewModelScope.launch {
            cartLocalDataSource.clearCart()
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

    fun createOrder(cartItems: List<CartItem>, totalPrice: Double, note: String, shippingAddress: String, paymentMethod: String) {
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
            if (response.isSuccessful) {
                val payment = Payment(
                    orderId = response.body()?.orderId ?: "",
                    customerId = orderBasic.customerId,
                    amount = orderBasic.totalPrice,
                    paymentMethod = paymentMethod
                )
                paymentRepository.createPayment(payment)
                _orderResponse.value = response
                cartLocalDataSource.clearCart()
                loadCartItems()
            }
        }
    }

    fun hasDifferentVendorItems(newVendorId: String): Boolean {
        val existingVendorIds = _cartItems.value.map { it.vendorId }.toSet()
        return existingVendorIds.isNotEmpty() && !existingVendorIds.contains(newVendorId)
    }

    fun clearOrderResponse() {
        _orderResponse.value = null
    }
}
