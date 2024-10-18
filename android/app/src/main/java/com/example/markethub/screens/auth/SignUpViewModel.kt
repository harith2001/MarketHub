package com.example.markethub.presentation.screens.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.data.models.SignUpRequest
import com.example.markethub.domain.models.SignUpResponse
import com.example.markethub.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import retrofit2.Response
import javax.inject.Inject

@HiltViewModel
class SignUpViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _signUpResponse = MutableStateFlow<Response<SignUpResponse>?>(null)
    val signUpResponse: StateFlow<Response<SignUpResponse>?> = _signUpResponse

    fun signUp(name: String, email: String, password: String, role: String) {
        viewModelScope.launch {
            val signUpRequest = SignUpRequest(name, email, password, role, false)
            _signUpResponse.value = authRepository.signUp(signUpRequest)
        }
    }

    fun resetSignUpResponse() {
        _signUpResponse.value = null
    }
}