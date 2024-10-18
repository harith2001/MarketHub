package com.example.markethub.domain.repository

import com.example.markethub.data.network.ApiService
import com.example.markethub.domain.models.OrderRating
import com.example.markethub.domain.models.OrderRatingSubmit
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OrderRatingRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun rateOrder(orderRating: OrderRatingSubmit): Response<Unit> {
        return apiService.rateOrder(orderRating)
    }

    suspend fun getRatingByOrderId(orderId: String): Response<OrderRating> {
        return apiService.getOrderRatingByOrderId(orderId)
    }
}