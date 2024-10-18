package com.example.markethub.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.LocalNavController
import com.example.markethub.screens.cart.CartViewModel
import com.example.markethub.screens.favorites.FavoritesViewModel
import com.example.markethub.screens.product.Badge
import com.example.markethub.ui.theme.Primary

@Composable
fun TopBarSection(
    favoritesViewModel: FavoritesViewModel = hiltViewModel(),
    cartViewModel: CartViewModel = hiltViewModel()
) {
    val navController = LocalNavController.current
    val favoriteItems by favoritesViewModel.favoriteItems.collectAsState()
    val cartItemsCount by cartViewModel.cartItemsCount.collectAsState()

    LaunchedEffect(true) {
        favoritesViewModel.loadFavoriteItems()
        cartViewModel.loadCartItems()
    }

    Row(
        modifier = Modifier
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(
            modifier = Modifier
                .weight(1f)
                .height(40.dp)
                .background(Color(0xFFF1F1F1), CircleShape)
                .padding(horizontal = 12.dp, vertical = 2.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search Icon",
                tint = Color.Gray,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))

            var searchText by remember { mutableStateOf("") }

            BasicTextField(
                value = searchText,
                onValueChange = { searchText = it },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                decorationBox = { innerTextField ->
                    if (searchText.isEmpty()) {
                        Text(
                            text = "Search Products...",
                            color = Color.Gray,
                            modifier = Modifier.padding(start = 4.dp)
                        )
                    }
                    innerTextField()
                },
                keyboardOptions = KeyboardOptions.Default.copy(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(
                    onSearch = {
                        if (searchText.isNotBlank()) {
                            navController.navigate("Search/$searchText")
                        }
                    }
                ),
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        Box {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(modifier = Modifier) {
                    IconButton(onClick = { navController.navigate("MyFavorites") }) {
                        Icon(
                            imageVector = Icons.Default.FavoriteBorder,
                            contentDescription = "Favorites Icon",
                            tint = Primary,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    if (favoriteItems.isNotEmpty()) {
                        Badge(count = favoriteItems.size, Modifier.align(Alignment.TopEnd))
                    }
                }
                Box(modifier = Modifier) {
                    IconButton(onClick = { navController.navigate("Cart") }) {
                        Icon(
                            imageVector = Icons.Outlined.ShoppingCart,
                            contentDescription = "Cart Icon",
                            tint = Primary,
                            modifier = Modifier.size(28.dp)
                        )
                    }
                    if (cartItemsCount > 0) {
                        Badge(count = cartItemsCount, Modifier.align(Alignment.TopEnd))
                    }
                }
            }
        }
    }
}