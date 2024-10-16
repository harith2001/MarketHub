package com.example.markethub.data.network

import com.example.markethub.data.models.ChangePasswordRequest
import com.example.markethub.data.models.SignInRequest
import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.Product
import com.example.markethub.domain.models.SignInResponse
import com.example.markethub.domain.models.SignUpResponse
import com.example.markethub.domain.models.User
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.POST
import retrofit2.http.PUT

interface ApiService {
    @POST("User")
    suspend fun signUp(@Body signUpRequest: SignUpRequest): Response<SignUpResponse>

    @POST("User/login")
    suspend fun signIn(@Body signInRequest: SignInRequest): Response<SignInResponse>

    @POST("User/logout")
    suspend fun signOut(): Response<Unit>

    @GET("User/email/{email}")
    suspend fun getUserByEmail(@Path("email") email: String): Response<User>

    @PUT("User/customer/{id}")
    suspend fun updateUser(@Path("id") id: String, @Body user: User): Response<User>

    @PUT("User/customer/password/{id}")
    suspend fun changePassword(@Path("id") id: String, @Body changePasswordRequest: ChangePasswordRequest): Response<Unit>

    @GET("products")
    suspend fun getProducts(): Response<List<Product>>

    @GET("products/{id}")
    suspend fun getProductById(@Path("id") id: Int): Response<Product>
}
