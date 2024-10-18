package com.example.markethub.screens.profile

import android.content.Context
import android.widget.Toast
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import androidx.navigation.NavController
import com.example.markethub.data.local.UserLocalDataSource
import com.example.markethub.data.models.ChangePasswordRequest
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

    fun updateUserProfile(userId: String, name: String, email: String, isActive: Boolean) {
        viewModelScope.launch {
            val updatedUser = User(userId, name, email, isActive)
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

    fun deactivateAccount(userId: String, userName: String, userEmail: String,
                          navController: NavController, context: Context) {
        viewModelScope.launch {
            val updatedUser = User(userId, userName, userEmail, false)
            val response = userRepository.updateUser(userId, updatedUser)
            if (response.isSuccessful) {
                userLocalDataSource.saveUser(updatedUser)
                _user.value = updatedUser
                saveSignInState(context, false)
                persistentCookieJar.clearCookies()
                navController.navigate("SignIn")
                Toast.makeText(context, "Account deactivated successfully. We're sad to see you go!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(context, "Failed to deactivate account. Please try again.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    fun changePassword(userId: String, oldPassword: String, newPassword: String,
                       confirmNewPassword: String, context: Context) {
        viewModelScope.launch {
            if (newPassword != confirmNewPassword) {
                _errorMessage.value = "New password and confirm new password do not match."
                return@launch
            }

            val response = userRepository.changePassword(userId, ChangePasswordRequest(oldPassword, newPassword))
            if (response.isSuccessful) {
                Toast.makeText(context, "Password changed successfully.", Toast.LENGTH_SHORT).show()
            } else {
                _errorMessage.value = "Failed to change password. Please try again."
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
