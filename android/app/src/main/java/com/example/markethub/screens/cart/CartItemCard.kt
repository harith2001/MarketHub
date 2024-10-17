package com.example.markethub.screens.cart

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.example.markethub.domain.models.CartItem
import com.example.markethub.ui.theme.Primary

@Composable
fun CartItemCard(
    cartItem: CartItem,
    onQuantityChange: (Int) -> Unit,
    onRemoveItem: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White, shape = RoundedCornerShape(12.dp))
            .padding(12.dp)
            .border(1.dp, Color.LightGray, shape = RoundedCornerShape(12.dp))
            .clip(RoundedCornerShape(12.dp))
            .padding(vertical = 16.dp, horizontal = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Image(
            painter = rememberAsyncImagePainter(model = cartItem.imageUrl), // Load image from URL
            contentDescription = cartItem.name,
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(12.dp))
                .border(1.dp, Color.LightGray, RoundedCornerShape(12.dp)),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.width(16.dp))

        Column(
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = cartItem.name,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 2,  // Limit to two lines
                modifier = Modifier.padding(bottom = 4.dp)
            )
            Text(
                text = "Rs.${"%.2f".format(cartItem.price)}",
                fontSize = 14.sp,
                color = Primary,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }

        // Quantity Control Section
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            IconButton(
                onClick = { if (cartItem.quantity > 1) onQuantityChange(cartItem.quantity - 1) },
                enabled = cartItem.quantity > 1,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Remove,
                    contentDescription = "Decrease Quantity",
                    tint = if (cartItem.quantity > 1) Color.Gray else Color.LightGray
                )
            }

            Text(
                text = "${cartItem.quantity}",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp,
                modifier = Modifier.padding(horizontal = 4.dp)
            )

            IconButton(
                onClick = { onQuantityChange(cartItem.quantity + 1) },
                modifier = Modifier.size(24.dp)
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Increase Quantity", tint = Primary)
            }
        }

        // Remove Item Button
        IconButton(
            onClick = onRemoveItem,
            modifier = Modifier
                .size(24.dp)
                .padding(start = 8.dp)
        ) {
            Icon(imageVector = Icons.Default.Delete, contentDescription = "Remove Item", tint = Color.Red)
        }
    }
}
