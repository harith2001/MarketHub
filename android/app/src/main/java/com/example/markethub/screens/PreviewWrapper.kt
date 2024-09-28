package com.example.markethub.screens

import androidx.compose.runtime.Composable
import androidx.navigation.compose.rememberNavController
import com.example.markethub.LocalNavController

@Composable
fun PreviewWrapper(content: @Composable () -> Unit) {
    val navController = rememberNavController()
    androidx.compose.runtime.CompositionLocalProvider(
        LocalNavController provides navController,
        content = content
    )
}