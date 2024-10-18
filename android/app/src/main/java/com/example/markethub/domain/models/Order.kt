package com.example.markethub.domain.models

data class OrderBasic(
    val orderID: String = "",
    val customerId: String,
    val items: List<OrderItem>,
    val totalPrice: Double,
    val note: String = "",
    val shippingAddress: String,
)

data class Order(
    val orderID: String,
    val customerId: String,
    val items: List<OrderItem>,
    val totalPrice: Double,
    val status: String,
    val note: String,
    val orderDate: String,
    val shippedDate: String,
    val shippingAddress: String,
    val createdAt: String,
)