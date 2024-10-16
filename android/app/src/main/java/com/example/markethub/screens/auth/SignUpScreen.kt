package com.example.markethub.screens.auth

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.markethub.R
import com.example.markethub.components.HeadingTextComponent
import com.example.markethub.components.NormalTextComponent
import com.example.markethub.components.PasswordField
import com.example.markethub.components.ValidatedTextFieldComponent
import com.example.markethub.extensions.isValidEmail
import com.example.markethub.presentation.screens.auth.SignUpViewModel
import com.example.markethub.ui.theme.Primary

@Composable
fun SignUpScreen(
    viewModel: SignUpViewModel = hiltViewModel(),
    onSignUpClick: () -> Unit = {},
    onSignInClick: () -> Unit = {}
) {
    val context = LocalContext.current

    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var role by remember { mutableStateOf("Customer") }

    val signUpResponse by viewModel.signUpResponse.collectAsStateWithLifecycle()

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
                NormalTextComponent(value = stringResource(id = R.string.hey_there))
                HeadingTextComponent(value = stringResource(id = R.string.create_an_account))

                ValidatedTextFieldComponent(
                    label = "Name",
                    isRequired = true,
                    validationRules = listOf(
                        { input -> if (input.length < 2) "Name should be at least 2 characters" else null },
                        { input -> if (input.any { it.isDigit() }) "Name should not contain numbers" else null },
                        { input -> if (input.any { !it.isLetter() }) "Name should contain only letters" else null }
                    ),
                    value = name,
                    onValueChange = { name = it }
                )

                ValidatedTextFieldComponent(
                    label = "Email Address",
                    isRequired = true,
                    validationRules = listOf { input -> if (!input.isValidEmail()) "Invalid email address format" else null },
                    value = email,
                    onValueChange = { email = it }
                )

                PasswordField(value = password, onValueChange = { password = it })
            }
            Column {
                Button(
                    onClick = {
                        viewModel.signUp(name, email, password, role)
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
                    Text(text = "Register", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                }

                LaunchedEffect(signUpResponse) {
                    signUpResponse?.let { response ->
                        if (response.isSuccessful) {
                            Toast.makeText(context, "Registered Request Submitted Successfully, Please wait for approval", Toast.LENGTH_SHORT).show()
                            onSignUpClick()
                        } else {
                            Toast.makeText(context, "Registration Failed, Please try again", Toast.LENGTH_SHORT).show()
                            response.errorBody()?.string()?.let { errorContent ->
                                println(errorContent)
                            }
                        }
                        viewModel.resetSignUpResponse()
                    }
                }

                Row(
                    modifier = Modifier
                        .padding(vertical = 16.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    HorizontalDivider(
                        modifier = Modifier.weight(1f),
                        thickness = 1.dp,
                        color = Color.Gray
                    )
                    Text(
                        text = "OR",
                        color = Color.Gray,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )
                    HorizontalDivider(
                        modifier = Modifier.weight(1f),
                        thickness = 1.dp,
                        color = Color.Gray
                    )
                }
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Already have an account? ",
                        fontSize = 16.sp,
                        color = Color.Gray
                    )
                    Text(
                        text = "Sign In",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Primary,
                        modifier = Modifier.clickable(onClick = onSignInClick)
                    )
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SignUpScreenPreview() {
    SignUpScreen()
}
