package com.example.markethub.data.network

import com.example.markethub.data.models.SignInRequest
import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.Product
import com.example.markethub.domain.models.SignInResponse
import com.example.markethub.domain.models.SignUpResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.POST

interface ApiService {
    @POST("User")
    suspend fun signUp(@Body signUpRequest: SignUpRequest): Response<SignUpResponse>

    @POST("User/login")
    suspend fun signIn(@Body signInRequest: SignInRequest): Response<SignInResponse>

    @GET("products")
    suspend fun getProducts(): Response<List<Product>>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Response<Product>
}
