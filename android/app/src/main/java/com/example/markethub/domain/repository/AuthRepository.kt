package com.example.markethub.domain.repository

import com.example.markethub.data.models.SignInRequest
import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.data.network.ApiService
import com.example.markethub.domain.models.SignInResponse
import com.example.markethub.domain.models.SignUpResponse
import retrofit2.Response

class AuthRepository(private val apiService: ApiService) {
    suspend fun signUp(signUpRequest: SignUpRequest): Response<SignUpResponse> {
        return apiService.signUp(signUpRequest)
    }

    suspend fun signIn(signInRequest: SignInRequest): Response<SignInResponse> {
        return apiService.signIn(signInRequest)
    }

    suspend fun signOut(): Response<Unit> {
        return apiService.signOut()
    }
}
