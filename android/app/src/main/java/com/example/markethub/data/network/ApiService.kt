package com.example.markethub.data.network

import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.SignUpResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("user")
    suspend fun signUp(@Body signUpRequest: SignUpRequest): Response<SignUpResponse>
}
