package com.example.markethub.domain.models

data class OrderItem(
    val productId: String,
    val vendorId: String,
    val productName: String,
    val productStatus: String = "Pending",
    val quantity: Int,
    val price: Double,
)