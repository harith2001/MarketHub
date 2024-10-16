package com.example.markethub.screens.profile

import android.content.Context
import android.widget.Toast
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavController
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.data.network.PersistentCookieJar
import com.example.markethub.domain.models.User
import com.example.markethub.domain.repository.AuthRepository
import com.example.markethub.domain.repository.UserRepository
import com.example.markethub.screens.auth.saveSignInState
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val authRepository: AuthRepository,
    private val userLocalDataSource: UserLocalDataSource,
    private val persistentCookieJar: PersistentCookieJar
) : ViewModel() {

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user

    private val _updateStatus = MutableStateFlow<Boolean?>(null)
    val updateStatus: StateFlow<Boolean?> = _updateStatus

    private val _errorMessage = MutableStateFlow<String?>(null)
    val errorMessage: StateFlow<String?> = _errorMessage

    init {
        loadUserData()
    }

    private fun loadUserData() {
        viewModelScope.launch {
            val storedUser = userLocalDataSource.getUser()
            _user.value = storedUser
        }
    }

    fun updateUserProfile(userId: String, name: String, email: String) {
        viewModelScope.launch {
            val updatedUser = User(userId, name, email)
            val response = userRepository.updateUser(userId, updatedUser)
            if (response.isSuccessful) {
                userLocalDataSource.saveUser(updatedUser)
                _user.value = updatedUser
                _updateStatus.value = true
            } else {
                _updateStatus.value = false
                _errorMessage.value = "Failed to update profile. Please try again."
            }
        }
    }

    fun signOut(navController: NavController, context: Context) {
        viewModelScope.launch {
            val response = authRepository.signOut()
            if (response.isSuccessful) {
                userLocalDataSource.clearUserData()
                saveSignInState(context, false)
                persistentCookieJar.clearCookies()
                navController.navigate("SignIn")
                _user.value = null
                Toast.makeText(context, "Signed out successfully. See you soon!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Failed to sign out. Please try again.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun resetUpdateStatus() {
        _updateStatus.value = null
    }

    fun clearErrorMessage() {
        _errorMessage.value = null
    }
}
