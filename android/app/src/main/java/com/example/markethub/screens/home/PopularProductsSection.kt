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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.components.ProductCard
import com.example.markethub.ui.theme.Primary

@Composable
fun PopularProductsSection(
    viewModel: HomeViewModel = hiltViewModel()
) {
    val products by viewModel.popularProducts.collectAsState()

    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Popular Products", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text(
                text = "See more",
                fontSize = 16.sp,
                color = Primary,
                modifier = Modifier.clickable { /* Navigate to see more products */ }
            )
        }

        LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            items(products) { product ->
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

/**
 * Truncate a given text to a specific length and add ellipsis if it exceeds the limit.
 */
fun truncateText(text: String, maxLength: Int): String {
    return if (text.length > maxLength) {
        text.take(maxLength) + "…"
    } else {
        text
    }
}

/**
 * Capitalize the first letter of each word in the given category string.
 */
fun formatCategory(category: String): String {
    return category.split(" ").joinToString(" ") { word ->
        word.lowercase().replaceFirstChar { it.uppercase() }
    }
}