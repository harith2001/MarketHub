package com.example.markethub.screens.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.components.ProductCard
import com.example.markethub.ui.theme.Primary

@Composable
fun FeaturedProductsSection(
    viewModel: HomeViewModel = hiltViewModel()
) {
    val featuredProducts by viewModel.featuredProducts.collectAsState()

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Featured Products", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text(
                text = "See more",
                fontSize = 16.sp,
                color = Primary,
                modifier = Modifier.clickable { /* Navigate to see more products */ }
            )
        }

        LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            items(featuredProducts) { product ->
                ProductCard(
                    productId = product.id,
                    image = product.image,
                    category = formatCategory(product.category),
                    name = truncateText(product.title, maxLength = 20),
                    rating = product.rating.rate.toString(),
                    reviews = product.rating.count.toString(),
                    price = "$${product.price}",
                    onFavoriteClick = { /* Handle favorite click */ }
                )
            }
        }
    }
}
