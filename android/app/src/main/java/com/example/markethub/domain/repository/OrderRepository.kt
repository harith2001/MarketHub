package com.example.markethub.domain.repository

import com.example.markethub.data.network.ApiService
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderBasic
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun createOrder(order: OrderBasic): Response<Order> {
        return apiService.createOrder(order)
    }

    suspend fun getOrdersByCustomerId(customerId: String): Response<List<Order>> {
        return apiService.getOrdersByCustomerId(customerId)
    }

    suspend fun getOrderById(orderId: String): Response<Order> {
        return apiService.getOrderById(orderId)
    }
}