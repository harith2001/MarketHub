package com.example.markethub.domain.models

data class CartItem(
    val id: Int,
    val name: String,
    val imageUrl: String,
    var quantity: Int,
    val price: Double
)