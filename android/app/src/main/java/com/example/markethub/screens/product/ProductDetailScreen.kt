package com.example.markethub.screens.product

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.screens.PreviewWrapper

@Composable
fun ProductDetailScreen(
    productId: Int,
    viewModel: ProductDetailViewModel = hiltViewModel(),
) {
    // Observe the product details state
    val productDetail by viewModel.productDetail.collectAsState()

    // Fetch product details when the screen is first loaded
    LaunchedEffect(productId) {
        viewModel.fetchProductById(productId)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        if (productDetail == null) {
            // Show a loading indicator while fetching the product details
            CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
        } else {
            // Show the product details once loaded
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 70.dp)
            ) {
                // Header Section
                ProductDetailsHeaderSection()

                // Image Section
                ImageSection(images = listOf(productDetail!!.image))

                // Product Details Section
                ProductDetailsSection(
                    vendorName = "MarketHub",
                    productName = productDetail!!.title,
                    rating = productDetail!!.rating.rate.toString(),
                    reviews = productDetail!!.rating.count.toString(),
                    sold = "1.2k",
                    inStock = true,
                    description = productDetail!!.description
                )
            }

            BottomPriceSection(
                price = "$${productDetail!!.price}",
                product = productDetail!!,
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }
}

@Preview
@Composable
fun ProductDetailScreenPreview() {
    PreviewWrapper {
        ProductDetailScreen(productId = 1) // Use a sample product ID for preview
    }
}
