package com.example.markethub.screens.home

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.components.ProductCard
import com.example.markethub.ui.theme.Primary

@Composable
fun PopularProductsSection() {
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

        // Displaying Popular Products
        LazyRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            items(6) {
                ProductCard(
                    image = "",
                    category = "Fashion",
                    name = "Men's Regular Fit Shirt",
                    rating = "4.5",
                    reviews = "200",
                    price = "$22.00",
                    onFavoriteClick = { /* Handle favorite click */ }
                )
            }
        }
    }
}