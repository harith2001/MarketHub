package com.example.markethub.screens.auth

import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.markethub.components.HeadingTextComponent
import com.example.markethub.components.NormalTextComponent
import com.example.markethub.components.PasswordField
import com.example.markethub.components.ValidatedTextFieldComponent
import com.example.markethub.extensions.isValidEmail
import com.example.markethub.presentation.screens.auth.SignInViewModel
import com.example.markethub.ui.theme.Primary
import okhttp3.HttpUrl.Companion.toHttpUrl

@Composable
fun SignInScreen(
    viewModel: SignInViewModel = hiltViewModel(),
    onSignInClick: () -> Unit = {},
    onSignUpClick: () -> Unit = {}
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }

    val signInResponse by viewModel.signInResponse.collectAsStateWithLifecycle()
    val context = LocalContext.current

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(top = 40.dp, start = 28.dp, end = 28.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .padding(bottom = 16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                NormalTextComponent(value = "Welcome Back!")
                HeadingTextComponent(value = "Sign in to Your Account")

                ValidatedTextFieldComponent(
                    label = "Email Address",
                    isRequired = true,
                    validationRules = listOf { input -> if (!input.isValidEmail()) "Invalid email address format" else null },
                    value = email,
                    onValueChange = { email = it }
                )

                PasswordField(value = password, onValueChange = { password = it }, disableValidation = true)
            }

            Column {
                Button(
                    onClick = {
                        viewModel.signIn(email, password)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(55.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Primary,
                        contentColor = Color.White
                    ),
                    shape = CircleShape
                ) {
                    Text(text = "Sign In", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Don’t have an account? ",
                        fontSize = 16.sp,
                        color = Color.Gray
                    )
                    Text(
                        text = "Sign Up",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Primary,
                        modifier = Modifier.clickable(onClick = onSignUpClick)
                    )
                }
            }
        }
    }

    LaunchedEffect(signInResponse) {
        signInResponse?.let { response ->
            val toastMessage = response.body()?.message ?: "Sign In Failed. Please try again."
            Toast.makeText(context, toastMessage, Toast.LENGTH_SHORT).show()
            if (response.isSuccessful) {
                saveSignInState(context, true)
                onSignInClick()
            } else {
                response.errorBody()?.string()?.let { errorContent ->
                    println(errorContent)
                }
            }
            viewModel.resetSignInResponse()
        }
    }
}

fun saveSignInState(context: Context, isSignedIn: Boolean) {
    val sharedPreferences = context.getSharedPreferences("userSession", Context.MODE_PRIVATE)
    sharedPreferences.edit().apply {
        putBoolean("isSignedIn", isSignedIn)
        apply()
    }
}

@Preview(showBackground = true)
@Composable
fun SignInScreenPreview() {
    SignInScreen()
}
