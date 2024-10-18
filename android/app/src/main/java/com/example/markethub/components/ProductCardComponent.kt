package com.example.markethub.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.example.markethub.LocalNavController
import com.example.markethub.domain.models.FavoriteItem
import com.example.markethub.screens.favorites.FavoritesViewModel
import com.example.markethub.ui.theme.Primary

@Composable
fun ProductCard(
    productId: String,
    image: String,
    category: String,
    name: String,
    rating: String,
    reviews: String,
    price: String,
    favoritesViewModel: FavoritesViewModel = hiltViewModel()
) {
    val navController = LocalNavController.current
    val favoriteItems by favoritesViewModel.favoriteItems.collectAsState()
    var isFavorite = favoriteItems.any { it.id == productId }

    LaunchedEffect(productId) {
        favoritesViewModel.loadFavoriteItems()
    }

    Column(
        modifier = Modifier
            .width(160.dp)
            .background(Color.White, shape = MaterialTheme.shapes.medium)
            .padding(8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(120.dp),
            contentAlignment = Alignment.TopEnd
        ) {
            Image(
                painter = rememberAsyncImagePainter(model = image),
                contentDescription = name,
                modifier = Modifier
                    .fillMaxSize()
                    .clickable(onClick = {
                        navController.navigate("ProductDetailScreen/$productId")
                    }),
            )
            IconButton(
                onClick = {
                    if (isFavorite) {
                        favoritesViewModel.removeFavoriteItem(productId)
                        isFavorite = false
                    } else {
                        favoritesViewModel.addFavoriteItem(FavoriteItem(productId, name, image,
                            price.replace("Rs.", "").trim().toDouble()))
                        isFavorite = true
                    }
                },
                modifier = Modifier
                    .padding(top = 16.dp, end = 4.dp)
                    .size(24.dp),
            ) {
                Icon(
                    imageVector = if (isFavorite) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                    contentDescription = "Add to Favorites",
                    tint = Color.Red
                )
            }
        }
        Text(
            text = category,
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
        Text(
            text = name,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(top = 4.dp)
        )
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 4.dp)
        ) {
            // Rating Section
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "Star Icon",
                    tint = Color(0xFFFFD700), // Gold color for star
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = rating,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "| $reviews",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
            }
            // Price Section
            Text(
                text = price,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Primary,
                modifier = Modifier.padding(end = 4.dp)
            )
        }
    }
}