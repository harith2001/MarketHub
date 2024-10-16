package com.example.markethub

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.markethub.screens.SplashScreen
import com.example.markethub.screens.auth.SignInScreen
import com.example.markethub.screens.auth.SignUpScreen
import com.example.markethub.screens.onboarding.OnboardingScreen
import com.example.markethub.screens.product.ProductDetailScreen
import com.example.markethub.ui.theme.MarketHubTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.navArgument
import com.example.markethub.screens.cart.CartScreen
import com.example.markethub.screens.checkout.CheckoutScreen
import com.example.markethub.screens.favorites.MyFavoritesScreen
import com.example.markethub.screens.orders.OrderDetailsScreen
import com.example.markethub.screens.product.ProductsViewScreen
import dagger.hilt.android.AndroidEntryPoint

val LocalNavController = compositionLocalOf<NavController> { error("No NavController found!") }

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MarketHubTheme {
                val navController = rememberNavController()
                val context = this

                CompositionLocalProvider(LocalNavController provides navController) {
                    AppNavigation(navController, context)
                }
            }
        }
    }
}

@Composable
fun AppNavigation(navController: NavHostController, context: MainActivity) {
    NavHost(navController = navController, startDestination = "Splash") {
        // Splash Screen Route
        composable("Splash") {
            SplashScreen(navController = navController, context = context)
        }

        // Onboarding Screen Route
        composable("Onboarding") {
            OnboardingScreen(navController = navController, context = context)
        }

        // Sign In Screen Route
        composable("SignIn") {
            SignInScreen(
                onSignInClick = { navController.navigate("Home") },
                onSignUpClick = { navController.navigate("SignUp") }
            )
        }

        // Sign Up Screen Route
        composable("SignUp") {
            SignUpScreen(
                onSignUpClick = { navController.navigate("SignIn") },
                onSignInClick = { navController.navigate("SignIn") }
            )
        }

        // Home Screen Route
        composable("Home") {
            Home()
        }

        // Product Detail Screen Route
        composable(
            route = "ProductDetailScreen/{productId}",
            arguments = listOf(navArgument("productId") { defaultValue = "0" })
        ) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId") ?: "0"
            ProductDetailScreen(productId = productId)
        }

        // Cart Screen Route
        composable("Cart") {
            CartScreen()
        }

        // Checkout Screen Route
        composable("Checkout") {
            CheckoutScreen()
        }

        // Order Details Screen Route
        composable(
            route = "OrderDetails/{orderId}",
            arguments = listOf(navArgument("orderId") { defaultValue = "0" })
        ) { backStackEntry ->
            val orderId = backStackEntry.arguments?.getString("orderId") ?: "0"
            OrderDetailsScreen(orderId = orderId)
        }

        // My Favorites Screen Route
        composable("MyFavorites") {
            MyFavoritesScreen()
        }

        // Product Filter Screen Route
        composable(
            route = "ProductFilter/{category}",
            arguments = listOf(navArgument("category") { defaultValue = "All" })
        ) { backStackEntry ->
            val category = backStackEntry.arguments?.getString("category") ?: "All"
            ProductsViewScreen(filterByCategory = category, searchQuery = null)
        }

        // Search Screen Route
        composable(
            route = "Search/{query}",
            arguments = listOf(navArgument("query") { defaultValue = "" })
        ) { backStackEntry ->
            val query = backStackEntry.arguments?.getString("query") ?: ""
            ProductsViewScreen(searchQuery = query, filterByCategory = null)
        }

        // All Products Screen Route
        composable("Products") {
            ProductsViewScreen(filterByCategory = null, searchQuery = null)
        }
    }
}
