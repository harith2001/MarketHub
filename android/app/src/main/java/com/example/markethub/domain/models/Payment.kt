package com.example.markethub.domain.models

data class Payment (
    val paymentID: String = "",
    val orderId: String,
    val customerId: String,
    val amount: Double,
    val paymentMethod: String,
    val status: String = "Completed",
)