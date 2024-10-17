package com.example.markethub.screens.orders

import android.content.Context
import android.widget.Toast
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderRating
import com.example.markethub.domain.models.OrderRatingSubmit
import com.example.markethub.domain.models.Payment
import com.example.markethub.domain.models.User
import com.example.markethub.domain.models.VendorDetails
import com.example.markethub.domain.repository.OrderRatingRepository
import com.example.markethub.domain.repository.OrderRepository
import com.example.markethub.domain.repository.PaymentRepository
import com.example.markethub.domain.repository.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OrderDetailsViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val paymentRepository: PaymentRepository,
    private val productRepository: ProductRepository,
    private val orderRatingRepository: OrderRatingRepository,
    private val userLocalDataSource: UserLocalDataSource
) : ViewModel() {

    private val _order = MutableStateFlow<Order?>(null)
    val order: StateFlow<Order?> = _order

    private val _orderRating = MutableStateFlow<OrderRating?>(null)
    val orderRating: StateFlow<OrderRating?> = _orderRating

    private val _vendor = MutableStateFlow<VendorDetails?>(null)
    val vendor: StateFlow<VendorDetails?> = _vendor

    private val _payment = MutableStateFlow<Payment?>(null)
    val payment: StateFlow<Payment?> = _payment

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user

    init {
        fetchUser()
    }

    private fun fetchUser() {
        viewModelScope.launch {
            _user.value = userLocalDataSource.getUser()
        }
    }

    fun fetchOrderDetails(orderId: String, context: Context) {
        viewModelScope.launch {
            try {
                val response = orderRepository.getOrderById(orderId)
                if (response.isSuccessful) {
                    _order.value = response.body()
                    val productResponse = productRepository.getProductById(_order.value?.items?.get(0)?.productId ?: "")
                    if (productResponse.isSuccessful) {
                        _vendor.value = productResponse.body()?.vendor
                    } else {
                        _errorMessage.value = "Failed to load product details."
                        Toast.makeText(context, "Failed to load product details.", Toast.LENGTH_SHORT).show()
                    }
                    val paymentResponse = paymentRepository.getPaymentByOrderId(orderId)
                    if (paymentResponse.isSuccessful) {
                        _payment.value = paymentResponse.body()
                    } else {
                        _errorMessage.value = "Failed to load payment details."
                        Toast.makeText(context, "Failed to load payment details.", Toast.LENGTH_SHORT).show()
                    }
                    val ratingResponse = orderRatingRepository.getRatingByOrderId(orderId)
                    if (ratingResponse.isSuccessful) {
                        _orderRating.value = ratingResponse.body()
                    }
                } else {
                    _errorMessage.value = "Failed to load order details."
                    Toast.makeText(context, "Failed to load order details.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                _errorMessage.value = "An error occurred: ${e.localizedMessage}"
                Toast.makeText(context, "An error occurred: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun rateOrder(orderRating: OrderRatingSubmit, context: Context) {
        viewModelScope.launch {
            try {
                val response = orderRatingRepository.rateOrder(orderRating)
                if (response.isSuccessful) {
                    _orderRating.value = OrderRating(
                        vendorRatings = listOf(orderRating.vendorRating),
                        productRatings = orderRating.productRatings
                    )
                    Toast.makeText(context, "Rating submitted successfully.", Toast.LENGTH_SHORT).show()
                } else {
                    Toast.makeText(context, "Failed to submit the rating.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(context, "An error occurred: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
            }
        }
    }

}
