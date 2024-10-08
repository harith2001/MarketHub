package com.example.markethub.screens.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.example.markethub.screens.PreviewWrapper

@Composable
fun HomeScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(bottom = 16.dp)
    ) {
        item {
            TopBarSection()
        }

        item {
            CategorySlider()
        }

        item {
            PopularProductsSection()
        }

        item {
            FeaturedProductsSection()
        }

        item {
            NewArrivalsSection()
        }
    }
}


@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    PreviewWrapper {
        HomeScreen()
    }
}
