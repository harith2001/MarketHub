package com.example.markethub.domain.repository

import com.example.markethub.data.network.ApiService
import com.example.markethub.domain.models.CreatePaymentResponse
import com.example.markethub.domain.models.Payment
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class PaymentRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun createPayment(payment: Payment): Response<CreatePaymentResponse> {
        return apiService.createPayment(payment)
    }

    suspend fun getPaymentByOrderId(orderId: String): Response<Payment> {
        return apiService.getPaymentByOrderId(orderId)
    }
}