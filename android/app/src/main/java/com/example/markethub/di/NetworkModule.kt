package com.example.markethub.di

import android.app.Application
import com.example.markethub.BuildConfig
import com.example.markethub.data.network.ApiService
import com.example.markethub.data.network.PersistentCookieJar
import com.example.markethub.domain.repository.AuthRepository
import com.example.markethub.domain.repository.ProductRepository
import com.example.markethub.domain.repository.UserRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BASIC
    }

    @Provides
    @Singleton
    fun provideCookieJar(application: Application): PersistentCookieJar {
        return PersistentCookieJar(application.applicationContext)
    }

    @Provides
    @Singleton
    fun provideOkHttpClient(cookieJar: PersistentCookieJar): OkHttpClient {
        return OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .addInterceptor(logging)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }

    @Provides
    @Singleton
    fun provideAuthRepository(apiService: ApiService): AuthRepository {
        return AuthRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideProductRepository(apiService: ApiService): ProductRepository {
        return ProductRepository(apiService)
    }

    @Provides
    @Singleton
    fun provideUserRepository(apiService: ApiService): UserRepository {
        return UserRepository(apiService)
    }
}
