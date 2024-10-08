package com.example.markethub.domain.repository

import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.data.network.ApiService
import com.example.markethub.domain.models.SignUpResponse
import retrofit2.Response

class AuthRepository(private val apiService: ApiService) {
    suspend fun signUp(signUpRequest: SignUpRequest): Response<SignUpResponse> {
        return apiService.signUp(signUpRequest)
    }

    suspend fun signIn(signUpRequest: SignUpRequest): Response<SignUpResponse> {
        return apiService.signIn(signUpRequest)
    }
}
