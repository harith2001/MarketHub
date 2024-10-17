package com.example.markethub.domain.models

data class CartItem(
    val id: String,
    val name: String,
    val imageUrl: String,
    var quantity: Int,
    val price: Double
)