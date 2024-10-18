package com.example.markethub.screens.product

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.LocalNavController
import com.example.markethub.components.ProductCard
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.screens.home.formatCategory
import com.example.markethub.screens.home.truncateText
import com.example.markethub.ui.theme.Primary


@Composable
fun ProductsViewScreen(
    filterByCategory: String? = null,
    searchQuery: String? = null,
    viewModel: ProductFilterViewModel = hiltViewModel()
) {
    val navController = LocalNavController.current

    LaunchedEffect(filterByCategory, searchQuery) {
        when {
            filterByCategory != null -> viewModel.getProductsByCategory(filterByCategory)
            searchQuery != null -> viewModel.searchProducts(searchQuery)
        }
    }

    val isLoading by viewModel.isLoading.collectAsState()
    val products by viewModel.products.collectAsState()
    val title = when {
        searchQuery != null -> "Search results for \"$searchQuery\""
        filterByCategory != null -> "Products for category \"$filterByCategory\""
        else -> "Products"
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 16.dp)
            .background(Color.White)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = Primary
                )
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp
            )
        }

        if (isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Primary)
            }
        } else if (products.isEmpty()) {
            EmptyStateMessage(title)
        } else {
            LazyVerticalGrid(
                columns = GridCells.Adaptive(minSize = 160.dp),
                modifier = Modifier.padding(16.dp).fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(products) { product ->
                    ProductCard(
                        productId = product.productId,
                        image = product.fullImageUrl ?: "",
                        category = formatCategory(product.productType),
                        name = truncateText(product.productName, maxLength = 20),
                        rating = product.rating.rate.toString(),
                        reviews = product.rating.count.toString(),
                        price = "Rs.${product.price}"
                    )
                }
            }
        }
    }
}

@Composable
fun EmptyStateMessage(title: String) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.Info,
                contentDescription = "No products found",
                tint = Color.Gray,
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "No products found.",
                fontSize = 18.sp,
                color = Color.Gray,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "Please try a different category or search term.",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
    }
}

@Preview
@Composable
fun ProductsViewScreenPreview() {
    PreviewWrapper {
        ProductsViewScreen()
    }
}
