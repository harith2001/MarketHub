package com.example.markethub.domain.models

import com.google.gson.annotations.SerializedName

data class User (
    @SerializedName("user_ID") val userId: String,
    val name: String,
    val email: String,
    val isActive: Boolean
)