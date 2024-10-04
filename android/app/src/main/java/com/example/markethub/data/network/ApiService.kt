package com.example.markethub.data.network

import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.Product
import com.example.markethub.domain.models.SignUpResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.POST

interface ApiService {
    @POST("user")
    suspend fun signUp(@Body signUpRequest: SignUpRequest): Response<SignUpResponse>

    @POST("user/login")
    suspend fun signIn(@Body signUpRequest: SignUpRequest): Response<SignUpResponse>

    @GET("products")
    suspend fun getProducts(): Response<List<Product>>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Response<Product>
}
