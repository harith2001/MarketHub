package com.example.markethub.screens.home

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.LocalGroceryStore
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.SportsSoccer
import androidx.compose.material.icons.filled.Toys
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.ui.theme.Primary
import com.google.accompanist.pager.ExperimentalPagerApi
import com.google.accompanist.pager.HorizontalPager
import com.google.accompanist.pager.rememberPagerState

data class Category(val label: String, val icon: ImageVector)


@OptIn(ExperimentalPagerApi::class)
@Composable
fun CategorySlider() {
    val categories = listOf(
        Category("Fashion", Icons.Default.ShoppingCart),
        Category("Electronics", Icons.Default.Smartphone),
        Category("Groceries", Icons.Default.LocalGroceryStore),
        Category("Toys", Icons.Default.Toys),
        Category("Books", Icons.Default.Book),
        Category("Sports", Icons.Default.SportsSoccer),
        Category("Beauty", Icons.Default.Face),
        Category("More", Icons.Default.MoreHoriz)
    )

    val pagerState = rememberPagerState(
        pageCount = (categories.size + 3) / 4
    )

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.wrapContentSize()
        ) { page ->
            Row(
                modifier = Modifier
                    .fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                val startIndex = page * 4
                val itemsToShow = categories.subList(startIndex, minOf(startIndex + 4, categories.size))
                itemsToShow.forEach { category ->
                    CategoryCard(category)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        PageIndicator(pageCount = pagerState.pageCount, currentPage = pagerState.currentPage)
    }
}

@Composable
fun CategoryCard(category: Category) {
    Column(
        modifier = Modifier
            .size(80.dp)
            .background(Color.White)
            .clickable { /* Handle category click */ },
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(Color(0xFFF1F1F1))
                .padding(8.dp),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = category.icon,
                contentDescription = category.label,
                tint = Primary,
                modifier = Modifier.size(32.dp)
            )
        }
        Text(
            text = category.label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = Color.Gray,
            modifier = Modifier.padding(top = 8.dp)
        )
    }
}

@Composable
fun PageIndicator(pageCount: Int, currentPage: Int) {
    Row(
        horizontalArrangement = Arrangement.Center,
        modifier = Modifier.fillMaxWidth()
    ) {
        repeat(pageCount) { page ->
            val width by animateDpAsState(targetValue = if (page == currentPage) 24.dp else 8.dp,
                label = ""
            )
            Box(
                modifier = Modifier
                    .padding(horizontal = 4.dp)
                    .height(8.dp)
                    .width(width)
                    .clip(CircleShape)
                    .background(if (page == currentPage) Primary else Color.Gray.copy(alpha = 0.5f))
            )
        }
    }
}
