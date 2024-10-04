package com.example.markethub.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.ExperimentalMaterial3Api
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
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ValidatedTextFieldComponent(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    isRequired: Boolean = true,
    validationRules: List<(String) -> String?> = listOf(),
    errorColor: Color = Color.Red
) {
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Column {
        OutlinedTextField(
            value = value,
            onValueChange = { newValue ->
                onValueChange(newValue)
                errorMessage = validateInput(newValue, isRequired, validationRules)
            },
            label = { Text(text = label) },
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 4.dp),
            isError = errorMessage != null,
            colors = TextFieldDefaults.outlinedTextFieldColors(
                focusedBorderColor = if (errorMessage != null) errorColor else
                    MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = if (errorMessage != null) errorColor else Color.Gray,
                errorBorderColor = errorColor,
                focusedLabelColor = if (errorMessage != null) errorColor else
                    MaterialTheme.colorScheme.primary,
                cursorColor = if (errorMessage != null) errorColor else
                    MaterialTheme.colorScheme.primary
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

private fun validateInput(
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
