package com.example.markethub.screens.orders

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.LocalNavController
import com.example.markethub.R
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.screens.cart.CartItem
import com.example.markethub.ui.theme.Primary

@Composable
fun OrderDetailsScreen(
    orderId: String = "123456",
    orderDate: String = "25th Sep, 2024",
    orderStatus: String = "Delivered",
    totalPrice: String = "$95.00",
    paymentMethod: String = "Cash on Delivery",
    deliveryAddress: String = "123 Main Street, New York, USA",
    items: List<CartItem> = sampleOrderItems()
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        val navController = LocalNavController.current
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Start,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = "Back",
                    tint = Primary
                )
            }
            Spacer(modifier = Modifier.width(16.dp))
            Text("Order Details", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Order Information Section
        OrderDetailsHeader(orderId, orderDate, orderStatus)

        Spacer(modifier = Modifier.height(16.dp))

        // Order Summary Section
        OrderSummarySection(totalPrice, paymentMethod, deliveryAddress)

        Spacer(modifier = Modifier.height(16.dp))

        // Items List Section
        Text("Items", fontSize = 20.sp, fontWeight = FontWeight.Bold)
        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(items.size) { index ->
                OrderItemCard(items[index])
            }
        }
    }
}

@Composable
fun OrderDetailsHeader(orderId: String, orderDate: String, orderStatus: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text("Order ID: $orderId", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text("Placed on: $orderDate", fontSize = 14.sp, color = Color.Gray)
        }

        // Status Badge
        Text(
            text = orderStatus,
            color = if (orderStatus == "Delivered") Color(0xFF4CAF50) else Color(0xFFF44336),
            fontWeight = FontWeight.Bold,
            modifier = Modifier
                .background(
                    color = if (orderStatus == "Delivered") Color(0xFFE8F5E9) else Color(0xFFFFEBEE),
                    shape = RoundedCornerShape(12.dp)
                )
                .padding(horizontal = 12.dp, vertical = 4.dp)
        )
    }
}

@Composable
fun OrderSummarySection(totalPrice: String, paymentMethod: String, deliveryAddress: String) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF8F8F8), shape = RoundedCornerShape(12.dp))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Total Price", fontSize = 16.sp, color = Color.Gray)
                Text(totalPrice, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Primary)
            }
            Text(paymentMethod, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text("Delivery Address", fontSize = 16.sp, color = Color.Gray)
        Text(deliveryAddress, fontSize = 14.sp)
    }
}

@Composable
fun OrderItemCard(item: CartItem) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF8F8F8), shape = RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Image(
            painter = painterResource(id = item.imageRes),
            contentDescription = item.name,
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color.LightGray),
            contentScale = ContentScale.Crop
        )

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(item.name, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("Quantity: ${item.quantity}", fontSize = 14.sp, color = Color.Gray)
        }

        Spacer(modifier = Modifier.weight(1f))

        Text("$${"%.2f".format(item.price)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Primary)
    }
}

@Composable
fun sampleOrderItems(): List<CartItem> {
    return listOf(
        CartItem(id = 1, name = "Casual Shirt", imageRes = R.drawable.ic_placeholder, quantity = 1, price = 30.0),
        CartItem(id = 2, name = "Jeans", imageRes = R.drawable.ic_placeholder, quantity = 2, price = 65.0),
        CartItem(id = 3, name = "Sneakers", imageRes = R.drawable.ic_placeholder, quantity = 1, price = 50.0),
        CartItem(id = 4, name = "Sunglasses", imageRes = R.drawable.ic_placeholder, quantity = 1, price = 25.0)
    )
}

@Preview
@Composable
fun OrderDetailsScreenPreview() {
    PreviewWrapper {
        OrderDetailsScreen()
    }
}
