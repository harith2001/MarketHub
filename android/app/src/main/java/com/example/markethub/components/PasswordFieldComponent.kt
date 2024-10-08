package com.example.markethub.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PasswordField(
    label: String = "Password",
    value: String,
    onValueChange: (String) -> Unit,
    isRequired: Boolean = true,
    minLength: Int = 6,
    validationRules: List<(String) -> String?> = listOf(
        { input -> if (input.length < minLength) "Password should be at least $minLength characters" else null },
        { input -> if (!input.any { it.isDigit() }) "Password should contain at least one number" else null },
        { input -> if (!input.any { it.isUpperCase() }) "Password should contain at least one uppercase letter" else null },
        { input -> if (!input.any { !it.isLetterOrDigit() }) "Password should contain at least one special character" else null }
    ),
    errorColor: Color = Color.Red,
    disableValidation: Boolean = false
) {
    var isError by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var passwordVisibility by remember { mutableStateOf(false) }

    Column(modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 4.dp)) {
        OutlinedTextField(
            value = value,
            onValueChange = { newValue ->
                onValueChange(newValue) // Notify the parent of the new value
                errorMessage = if (disableValidation) null else validatePasswordInput(
                    newValue,
                    isRequired,
                    validationRules
                )
                isError = errorMessage != null
            },
            label = { Text(text = label) },
            visualTransformation = if (passwordVisibility) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                val image = if (passwordVisibility) Icons.Filled.VisibilityOff else Icons.Filled.Visibility
                IconButton(onClick = { passwordVisibility = !passwordVisibility }) {
                    Icon(
                        imageVector = image,
                        contentDescription = if (passwordVisibility) "Hide password" else "Show password"
                    )
                }
            },
            isError = isError,
            modifier = Modifier.fillMaxWidth(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = if (isError) errorColor else MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = if (isError) errorColor else Color.Gray,
                errorBorderColor = errorColor,
                focusedLabelColor = if (isError) errorColor else MaterialTheme.colorScheme.primary
            )
        )

        if (errorMessage != null) {
            Text(
                text = errorMessage!!,
                color = errorColor,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp)
            )
        }
    }
}

private fun validatePasswordInput(
    input: String,
    isRequired: Boolean,
    validationRules: List<(String) -> String?>
): String? {
    if (isRequired && input.isBlank()) {
        return "This field is required"
    }

    validationRules.forEach { rule ->
        val result = rule(input)
        if (result != null) return result
    }

    return null
}