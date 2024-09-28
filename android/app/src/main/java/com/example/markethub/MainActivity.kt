package com.example.markethub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.markethub.ui.theme.MarketHubTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MarketHubTheme {
                val navController = rememberNavController()

                NavHost(navController = navController, startDestination = "Splash") {
                    composable("Splash") {
                        SplashScreen(navController = navController, context = this@MainActivity)
                    }
                    composable("Onboarding") {
                        OnboardingScreen(navController = navController, context = this@MainActivity)
                    }
                    composable("Home") {
                        MainScreen()
                    }
                }
            }
        }
    }
}