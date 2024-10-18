package com.example.markethub.data.network

import com.example.markethub.data.models.ChangePasswordRequest
import com.example.markethub.data.models.SignInRequest
import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.CreateOrderResponse
import com.example.markethub.domain.models.CreatePaymentResponse
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderBasic
import com.example.markethub.domain.models.OrderRating
import com.example.markethub.domain.models.OrderRatingSubmit
import com.example.markethub.domain.models.Payment
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
import retrofit2.http.Query

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

    @GET("ProductReadView")
    suspend fun getProducts(): Response<List<Product>>

    @GET("ProductReadView/by-product-id/{id}")
    suspend fun getProductById(@Path("id") id: String): Response<Product>

    @GET("ProductReadView/by-product-type/{category}")
    suspend fun getProductsByCategory(@Path("category") category: String): Response<List<Product>>

    @GET("ProductReadView/search")
    suspend fun searchProducts(@Query("query") query: String): Response<List<Product>>

    @POST("Order/create")
    suspend fun createOrder(@Body order: OrderBasic): Response<CreateOrderResponse>

    @GET("Order/customer/{customerId}")
    suspend fun getOrdersByCustomerId(@Path("customerId") customerId: String): Response<List<Order>>

    @GET("Order/{orderId}")
    suspend fun getOrderById(@Path("orderId") orderId: String): Response<Order>

    @PUT("Order/{orderId}/{status}")
    suspend fun updateOrderStatus(@Path("orderId") orderId: String, @Path("status") status: String): Response<Unit>

    @POST("Payment/create")
    suspend fun createPayment(@Body payment: Payment): Response<CreatePaymentResponse>

    @GET("Payment/order/{orderId}")
    suspend fun getPaymentByOrderId(@Path("orderId") orderId: String): Response<Payment>

    @POST("OrderRating/rate")
    suspend fun rateOrder(@Body orderRating: OrderRatingSubmit): Response<Unit>

    @GET("OrderRating/rate/{orderId}")
    suspend fun getOrderRatingByOrderId(@Path("orderId") orderId: String): Response<OrderRating>
}
