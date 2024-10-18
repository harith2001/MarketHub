package com.example.markethub.domain.models

data class OrderRating (
    val vendorRatings: List<VendorRating>,
    val productRatings: List<ProductRating>
)

data class OrderRatingSubmit (
    val vendorRating: VendorRating,
    val productRatings: List<ProductRating>
)

data class VendorRating (
    val vendorId: String,
    val vendorName: String,
    val customerName: String,
    val rating: String,
    val comment: String,
    val orderID: String
)

data class ProductRating (
    val productId: String,
    val customerName: String,
    val rating: String,
    val comment: String,
    val vendorId: String,
    val orderID: String
)