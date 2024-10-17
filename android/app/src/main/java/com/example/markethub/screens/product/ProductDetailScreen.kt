package com.example.markethub.screens.product

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
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
    productId: String,
    viewModel: ProductDetailViewModel = hiltViewModel(),
) {
    if (productId == "0") {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(bottom = 70.dp)
            ) {
                // Header Section
                ProductDetailsHeaderSection()

                // Not Found Section
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = "Product Not Found", color = Color.Gray)
                }
            }
        }
    } else {
        val productDetail by viewModel.productDetail.collectAsState()

        LaunchedEffect(productId) {
            viewModel.fetchProductById(productId)
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
        ) {
            if (productDetail == null) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(bottom = 70.dp)
                ) {
                    ProductDetailsHeaderSection()

                    ImageSection(images = listOf(productDetail!!.fullImageUrl ?: ""))

                    ProductDetailsSection(
                        vendorName = productDetail!!.vendor?.vendorName ?: "",
                        productName = productDetail!!.productName,
                        rating = productDetail!!.rating.rate.toString(),
                        reviews = productDetail!!.rating.count.toString(),
                        sold = "1.2k",
                        inStock = productDetail!!.quantity!! > 0,
                        description = productDetail!!.productDescription ?: ""
                    )
                }

                BottomPriceSection(
                    price = "Rs.${productDetail!!.price}",
                    product = productDetail!!,
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }
    }
}

@Preview
@Composable
fun ProductDetailScreenPreview() {
    PreviewWrapper {
        ProductDetailScreen(productId = "0")
    }
}
