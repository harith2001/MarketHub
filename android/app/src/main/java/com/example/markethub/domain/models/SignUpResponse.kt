package com.example.markethub.domain.models

import com.fasterxml.jackson.annotation.JsonProperty

data class SignUpResponse(
    @JsonProperty("user_ID") val userId: Int,
    val name: String,
    val email: String
)