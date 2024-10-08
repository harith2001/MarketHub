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
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter

@Composable
fun ImageSection(
    images: List<String> // Accept a list of image URLs as parameters
) {
    // Handle case where no images are provided
    if (images.isEmpty()) return

    // State to track the currently displayed image
    val selectedImage = remember { mutableIntStateOf(0) }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 2.dp),
        contentAlignment = Alignment.Center
    ) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            // Thumbnail Column - Display only if multiple images exist
            if (images.size > 1) {
                Column(
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    images.forEachIndexed { index, imageUrl ->
                        ThumbnailImage(
                            imageUrl = imageUrl,
                            isSelected = index == selectedImage.intValue,
                            onClick = { selectedImage.intValue = index }
                        )
                    }
                }
            }

            // Main Image Display
            Image(
                painter = rememberAsyncImagePainter(model = images[selectedImage.intValue]), // Use Coil to load network image
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
fun ThumbnailImage(imageUrl: String, isSelected: Boolean, onClick: () -> Unit) {
    Image(
        painter = rememberAsyncImagePainter(model = imageUrl), // Use Coil for thumbnail image loading
        contentDescription = "Thumbnail Image",
        modifier = Modifier
            .size(60.dp)
            .clip(RoundedCornerShape(8.dp))
            .border(
                width = if (isSelected) 2.dp else 1.dp, // Change width for selected border
                color = if (isSelected) Color(0xFF00C569) else Color.Transparent,
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() },
        contentScale = ContentScale.Crop
    )
}
