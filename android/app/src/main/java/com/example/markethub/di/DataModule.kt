package com.example.markethub.di

import android.content.Context
import com.example.markethub.data.local.CartLocalDataSource
import com.example.markethub.data.local.UserLocalDataSource
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DataModule {

    @Provides
    @Singleton
    fun provideUserLocalDataSource(@ApplicationContext context: Context): UserLocalDataSource {
        return UserLocalDataSource(context)
    }

    @Provides
    @Singleton
    fun provideCartLocalDataSource(@ApplicationContext context: Context): CartLocalDataSource {
        return CartLocalDataSource(context)
    }
}