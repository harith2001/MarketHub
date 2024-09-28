package com.example.markethub

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.markethub.ui.theme.Primary

enum class BottomNavScreen(val route: String, val icon: ImageVector, val title: String) {
    Orders("Orders", Icons.AutoMirrored.Filled.List, "Orders"),
    Home("Home", Icons.Filled.Home, "Home"),
    Profile("Profile", Icons.Filled.Person, "Profile")
}


@Composable
fun Home() {
    val navController = rememberNavController()
    Scaffold(
        bottomBar = { BottomNavigationBar(navController = navController) }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = BottomNavScreen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(BottomNavScreen.Orders.route) {
                OrdersScreen()
            }
            composable(BottomNavScreen.Home.route) {
                HomeScreen()
            }
            composable(BottomNavScreen.Profile.route) {
                ProfileScreen()
            }
        }
    }
}

// Composable for the Bottom Navigation Bar
@Composable
fun BottomNavigationBar(navController: NavHostController) {
    val items = listOf(BottomNavScreen.Orders, BottomNavScreen.Home, BottomNavScreen.Profile)
    var selectedItem by remember { mutableStateOf(BottomNavScreen.Home.route) }

    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 4.dp
    ) {
        items.forEach { screen ->
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = screen.icon,
                        contentDescription = screen.title
                    )
                },
                label = { Text(screen.title) },
                selected = selectedItem == screen.route,
                onClick = {
                    selectedItem = screen.route
                    navController.navigate(screen.route) {
                        popUpTo(navController.graph.startDestinationId)
                        launchSingleTop = true
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Primary,
                    selectedTextColor = Primary,
                    unselectedIconColor = Color.Gray,
                    unselectedTextColor = Color.Gray,
                    indicatorColor = Primary.copy(alpha = 0.1f)
                )
            )
        }
    }
}

@Composable
fun OrdersScreen() {
    Surface(modifier = Modifier.fillMaxSize()) {
        Text(text = "Orders Screen", modifier = Modifier.padding(16.dp))
    }
}


@Composable
fun HomeScreen() {
    Surface(modifier = Modifier.fillMaxSize()) {
        Text(text = "Home Screen", modifier = Modifier.padding(16.dp))
    }
}

@Composable
fun ProfileScreen() {
    Surface(modifier = Modifier.fillMaxSize()) {
        Text(text = "Profile Screen", modifier = Modifier.padding(16.dp))
    }
}

@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    Home()
}
