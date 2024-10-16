package com.example.markethub.domain.repository

import com.example.markethub.domain.models.User
import com.example.markethub.data.network.ApiService
import retrofit2.Response
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class UserRepository @Inject constructor(
    private val apiService: ApiService
) {
    suspend fun getUserByEmail(email: String): Response<User> {
        return apiService.getUserByEmail(email)
    }

    suspend fun updateUser(id: String, user: User): Response<User> {
        return apiService.updateUser(id, user)
    }
}