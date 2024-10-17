package com.example.markethub.domain.repository

import com.example.markethub.domain.models.Product
import com.example.markethub.data.network.ApiService
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ProductRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getProducts(): Response<List<Product>> {
        return apiService.getProducts()
    }

    suspend fun getPopularProducts(): Response<List<Product>> {
        return apiService.getProducts()
    }

    suspend fun getNewArrivals(): Response<List<Product>> {
        return apiService.getProducts()
    }

    suspend fun getFeaturedProducts(): Response<List<Product>> {
        return apiService.getProducts()
    }

    suspend fun getProductById(id: String): Response<Product> {
        return apiService.getProductById(id)
    }
}
