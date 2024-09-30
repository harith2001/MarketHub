package com.example.markethub.screens.product

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.example.markethub.R

@Composable
fun ImageSection() {
    // Sample images (replace with real product images)
    val images = listOf(
        R.drawable.ic_placeholder,
        R.drawable.ic_placeholder_2
    )

    // State to track the currently displayed image
    val selectedImage = remember { mutableIntStateOf(images[0]) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 2.dp),
        contentAlignment = Alignment.Center // Center align the whole section
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            // Thumbnail Column
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                images.forEach { imageRes ->
                    ThumbnailImage(
                        imageRes = imageRes,
                        isSelected = imageRes == selectedImage.intValue,
                        onClick = { selectedImage.intValue = imageRes }
                    )
                }
            }

            // Main Image Display
            Image(
                painter = painterResource(id = selectedImage.intValue),
                contentDescription = "Selected Product Image",
                modifier = Modifier
                    .size(280.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .border(2.dp, Color.LightGray, RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
        }
    }
}

@Composable
fun ThumbnailImage(imageRes: Int, isSelected: Boolean, onClick: () -> Unit) {
    Image(
        painter = painterResource(id = imageRes),
        contentDescription = "Thumbnail Image",
        modifier = Modifier
            .size(60.dp)
            .clip(RoundedCornerShape(8.dp))
            .border(
                width = if (isSelected) 1.dp else 1.dp,
                color = if (isSelected) Color(0xFF00C569) else Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() },
        contentScale = ContentScale.Crop
    )
}