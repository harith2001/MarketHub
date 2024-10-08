package com.example.markethub.screens.product

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.LocalNavController
import com.example.markethub.components.ProductCard
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.ui.theme.Primary

data class Product(
    val id: String,
    val imageRes: String,
    val category: String,
    val name: String,
    val rating: String,
    val reviews: String,
    val price: String
)

@Composable
fun ProductsViewScreen(
    title: String = "Products",
    products: List<Product> = sampleProducts()
) {
    val navController = LocalNavController.current

    Column(
        modifier = Modifier
            .fillMaxSize()
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

        LazyVerticalGrid(
            columns = GridCells.Adaptive(minSize = 160.dp),
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(products.size) { index ->
                ProductCard(
                    productId = index,
                    image = products[index].imageRes,
                    category = products[index].category,
                    name = products[index].name,
                    rating = products[index].rating,
                    reviews = products[index].reviews,
                    price = products[index].price,
                    onFavoriteClick = {
                    }
                )
            }
        }
    }
}

// Sample data to visualize the grid
@Composable
fun sampleProducts(): List<Product> {
    return listOf(
        Product(
            id = "1",
            imageRes = "ic_placeholder",
            category = "Fashion",
            name = "Men's Casual Shirt",
            rating = "4.5",
            reviews = "1234",
            price = "$30.00"
        ),
        Product(
            id = "2",
            imageRes = "ic_placeholder",
            category = "Electronics",
            name = "Wireless Earbuds",
            rating = "4.7",
            reviews = "879",
            price = "$99.99"
        ),
        Product(
            id = "3",
            imageRes = "ic_placeholder",
            category = "Home & Living",
            name = "Comfortable Sofa",
            rating = "4.2",
            reviews = "354",
            price = "$250.00"
        ),
        Product(
            id = "4",
            imageRes = "ic_placeholder",
            category = "Beauty",
            name = "Skin Care Set",
            rating = "4.8",
            reviews = "432",
            price = "$75.00"
        )
    )
}

@Preview
@Composable
fun ProductsViewScreenPreview() {
    PreviewWrapper {
        ProductsViewScreen()
    }
}
