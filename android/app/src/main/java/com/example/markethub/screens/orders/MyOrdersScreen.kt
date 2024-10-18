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
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.example.markethub.BuildConfig
import com.example.markethub.LocalNavController
import com.example.markethub.domain.models.Order
import com.example.markethub.domain.models.OrderItem
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.ui.theme.Primary
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

@Composable
fun OrdersScreen(
    orderViewModel: OrderViewModel = hiltViewModel()
) {
    val orders by orderViewModel.orders.collectAsState()
    val customerID by orderViewModel.customerId.collectAsState()
    val loading by orderViewModel.loading.collectAsState()

    LaunchedEffect(true) {
        orderViewModel.fetchOrders(customerID)
    }
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

        if (loading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Primary)
            }
        } else if (orders.isEmpty()) {
            EmptyOrdersView()
        } else {
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
                    text = "Order ID: ${order.orderID}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                val parsedDate = OffsetDateTime.parse(order.orderDate)
                val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")
                val formattedDate = parsedDate.format(formatter)
                Text(
                    text = formattedDate,
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
                    text = "Rs.${"%.2f".format(order.totalPrice)}",
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
                onClick = { navController.navigate("OrderDetails/${order.orderID}") },
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
            painter = rememberAsyncImagePainter(model = "${BuildConfig.BASE_URL}Product/get-product-image/${item.productId}"),
            contentDescription = item.productName,
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color.LightGray),
            contentScale = ContentScale.Crop
        )

        Column {
            Text(text = item.productName, fontSize = 14.sp, fontWeight = FontWeight.Bold)
            Text(text = "Quantity: ${item.quantity}", color = Color.Gray, fontSize = 12.sp)
        }

        Spacer(modifier = Modifier.weight(1f))

        Text(
            text = "Rs.${"%.2f".format(item.price)}",
            fontWeight = FontWeight.Bold,
            fontSize = 14.sp,
            color = Primary
        )
    }
}

@Preview(showBackground = true)
@Composable
fun OrdersScreenPreview() {
    PreviewWrapper {
        OrdersScreen()
    }
}