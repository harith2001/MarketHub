package com.example.markethub.domain.models

import com.example.markethub.BuildConfig

data class Product(
    val productId: String,
    val productName: String,
    val productType: String,
    val productDescription: String? = null,
    val productImage: String? = null,
    val quantity: Int? = null,
    val price: Double,
    val rating: Rating,
    val isActive: Boolean,
    val vendor: VendorDetails? = null
){
    val fullImageUrl: String?
        get() = productImage?.let { "${BuildConfig.BASE_URL}$it" }
}

data class VendorDetails(
    val vendorId: String,
    val vendorName: String,
    val rating: Rating
)
