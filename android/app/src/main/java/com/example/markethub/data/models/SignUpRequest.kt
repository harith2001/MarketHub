package com.example.markethub.data.models

data class SignUpRequest(
    val name: String,
    val email: String,
    val password: String,
    val role: String
)