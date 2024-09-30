package com.example.markethub.screens.orders

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
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
import com.example.markethub.ui.theme.Primary

data class Order(
    val orderId: String,
    val orderDate: String,
    val totalItems: Int,
    val totalPrice: Double,
    val status: String,
    val items: List<OrderItem>
)

data class OrderItem(
    val name: String,
    val quantity: Int,
    val price: Double,
    val imageRes: Int
)

@Composable
fun OrdersScreen(
    orders: List<Order> = sampleOrders()
) {
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
            Text(
                text = "My Orders",
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        if (orders.isEmpty()) {
            EmptyOrdersView()
        } else {
            // Orders List
            LazyColumn(
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(orders.size) { index ->
                    OrderCard(order = orders[index])
                }
            }
        }
    }
}

@Composable
fun EmptyOrdersView() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = Icons.Default.ShoppingBag,
                contentDescription = "No Orders",
                tint = Color.LightGray,
                modifier = Modifier.size(96.dp)
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "You have no orders yet!",
                fontSize = 18.sp,
                fontWeight = FontWeight.Medium,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "Start shopping and track your orders here.",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
    }
}

@Composable
fun OrderCard(order: Order) {
    val navController = LocalNavController.current
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .padding(8.dp),
        elevation = CardDefaults.cardElevation(1.dp),
        colors = CardDefaults.cardColors(
            containerColor = Color(0xFFF8F8F8),
        )
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Order ID: ${order.orderId}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Text(
                    text = order.orderDate,
                    color = Color.Gray,
                    fontSize = 12.sp
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                StatusBadge(status = order.status)

                Text(
                    text = "$${"%.2f".format(order.totalPrice)}",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Primary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                order.items.forEach { item ->
                    OrderItemRow(item = item)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = { navController.navigate("OrderDetails") },
                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(text = "View Details", color = Color.White)
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val backgroundColor = when (status) {
        "Delivered" -> Color(0xFF4CAF50)
        "Shipped" -> Color(0xFF2196F3)
        "Cancelled" -> Color.LightGray
        else -> Color.Gray
    }

    Surface(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(backgroundColor)
            .padding(horizontal = 12.dp, vertical = 4.dp),
        color = Color.Transparent
    ) {
        Text(
            text = status,
            color = Color.White,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun OrderItemRow(item: OrderItem) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        modifier = Modifier.fillMaxWidth()
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

        Column {
            Text(text = item.name, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Text(text = "Quantity: ${item.quantity}", color = Color.Gray, fontSize = 12.sp)
        }

        Spacer(modifier = Modifier.weight(1f))

        Text(
            text = "$${"%.2f".format(item.price)}",
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Primary
        )
    }
}

@Composable
fun sampleOrders(): List<Order> {
    return listOf(
        Order(
            orderId = "123456",
            orderDate = "25th Sep, 2024",
            totalItems = 3,
            totalPrice = 95.0,
            status = "Delivered",
            items = listOf(
                OrderItem("Casual Shirt", 1, 30.0, R.drawable.ic_placeholder),
                OrderItem("Jeans", 2, 65.0, R.drawable.ic_placeholder)
            )
        ),
        Order(
            orderId = "654321",
            orderDate = "28th Sep, 2024",
            totalItems = 2,
            totalPrice = 55.0,
            status = "Shipped",
            items = listOf(
                OrderItem("T-Shirt", 1, 25.0, R.drawable.ic_placeholder),
                OrderItem("Sneakers", 1, 30.0, R.drawable.ic_placeholder)
            )
        )
    )
}

@Preview(showBackground = true)
@Composable
fun OrdersScreenPreview() {
    PreviewWrapper {
        OrdersScreen()
    }
}