package com.example.markethub.data.models

data class ChangePasswordRequest(
    val oldPassword: String,
    val newPassword: String
)