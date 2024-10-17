package com.example.markethub.screens.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.Product
import com.example.markethub.domain.models.VendorDetails
import com.example.markethub.domain.repository.OrderRepository
import com.example.markethub.domain.repository.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OrderDetailsViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val productRepository: ProductRepository
) : ViewModel() {

    private val _order = MutableStateFlow<Order?>(null)
    val order: StateFlow<Order?> = _order

    private val _vendor = MutableStateFlow<VendorDetails?>(null)
    val vendor: StateFlow<VendorDetails?> = _vendor

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    fun fetchOrderDetails(orderId: String) {
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
                    }
                } else {
                    _errorMessage.value = "Failed to load order details."
                }
            } catch (e: Exception) {
                _errorMessage.value = "An error occurred: ${e.localizedMessage}"
            }
        }
    }
}
