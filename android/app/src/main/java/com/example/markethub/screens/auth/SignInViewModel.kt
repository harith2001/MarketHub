package com.example.markethub.presentation.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.data.models.SignInRequest
import com.example.markethub.domain.models.SignInResponse
import com.example.markethub.domain.repository.AuthRepository
import com.example.markethub.domain.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.Response
import javax.inject.Inject

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val userRepository: UserRepository,
    private val userLocalDataSource: UserLocalDataSource
) : ViewModel() {

    private val _signInResponse = MutableStateFlow<Response<SignInResponse>?>(null)
    val signInResponse: StateFlow<Response<SignInResponse>?> = _signInResponse

    fun signIn(email: String, password: String) {
        viewModelScope.launch {
            val signInRequest = SignInRequest(email, password)
            val response = authRepository.signIn(signInRequest)
            _signInResponse.value = response

            if (response.isSuccessful) {
                saveUserByEmail(email)
            }
        }
    }

    private suspend fun saveUserByEmail(email: String) {
        val userResponse = userRepository.getUserByEmail(email)
        if (userResponse.isSuccessful) {
            userResponse.body()?.let { user ->
                userLocalDataSource.saveUser(user)
            }
        }
    }

    fun resetSignInResponse() {
        _signInResponse.value = null
    }
}
