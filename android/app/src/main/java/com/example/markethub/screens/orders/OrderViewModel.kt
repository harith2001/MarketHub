package com.example.markethub.screens.orders

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.repository.OrderRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class OrderViewModel @Inject constructor(
    private val orderRepository: OrderRepository,
    private val userLocalDataSource: UserLocalDataSource,
) : ViewModel() {

    private val _orders = MutableStateFlow<List<Order>>(emptyList())
    val orders: StateFlow<List<Order>> = _orders

    private val _loading = MutableStateFlow(true)
    val loading: StateFlow<Boolean> = _loading

    private val _customerId = MutableStateFlow(userLocalDataSource.getUser()?.userId ?: "")
    val customerId: StateFlow<String> = _customerId

    init {
        fetchOrders(customerId.value)
    }

    fun fetchOrders(customerId: String) {
        viewModelScope.launch {
            _loading.value = true
            val response = orderRepository.getOrdersByCustomerId(customerId)
            if (response.isSuccessful) {
                val orders = response.body() ?: emptyList()
                _orders.value = orders.reversed()
            } else {
                _orders.value = emptyList()
            }
            _loading.value = false
        }
    }
}
