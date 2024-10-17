package com.example.markethub.screens.orders

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.StarBorder
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.example.markethub.BuildConfig
import com.example.markethub.LocalNavController
import com.example.markethub.components.ValidatedTextFieldComponent
import com.example.markethub.domain.models.OrderItem
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.ui.theme.Primary

@Composable
fun OrderDetailsScreen(
    orderId: String,
    viewModel: OrderDetailsViewModel = hiltViewModel()
) {
    val order by viewModel.order.collectAsState()
    val vendor by viewModel.vendor.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()
    var showDialog by remember { mutableStateOf(false) }

    LaunchedEffect(orderId) {
        viewModel.fetchOrderDetails(orderId)
    }

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

        if (order != null) {
            OrderDetailsHeader(orderId, order!!.orderDate, order!!.status)
            Spacer(modifier = Modifier.height(16.dp))
            OrderSummarySection(
                totalPrice = "$${order!!.totalPrice}",
                paymentMethod = "Cash on Delivery",
                deliveryAddress = order!!.shippingAddress,
                vendorName = vendor?.vendorName ?: ""
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("Items", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(order!!.items.size) { index ->
                    OrderItemCard(order!!.items[index])
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (order!!.status == "Delivered") {
                Button(
                    onClick = { showDialog = true },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    colors = ButtonDefaults.buttonColors(containerColor = Primary)
                ) {
                    Text(text = "Rate Your Order", fontSize = 16.sp, color = Color.White)
                }
            }
        } else if (errorMessage != null) {
            Text(text = errorMessage!!, color = Color.Red)
        }
    }

    if (showDialog) {
        RateOrderDialog(
            items = order?.items ?: emptyList(),
            vendorName = vendor?.vendorName ?: "",
            onDismiss = { showDialog = false },
            onRateOrder = { showDialog = false }
        )
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
fun OrderSummarySection(
    totalPrice: String,
    paymentMethod: String,
    deliveryAddress: String,
    vendorName: String
) {
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

        Spacer(modifier = Modifier.height(8.dp))

        Text("Vendor", fontSize = 16.sp, color = Color.Gray)
        Text(vendorName, fontSize = 14.sp, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun OrderItemCard(item: OrderItem) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFFF8F8F8), shape = RoundedCornerShape(12.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
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

        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(item.productName, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text("Quantity: ${item.quantity}", fontSize = 14.sp, color = Color.Gray)
        }

        Spacer(modifier = Modifier.weight(1f))

        Text(
            "$${"%.2f".format(item.price)}",
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = Primary
        )
    }
}

@Composable
fun RateOrderDialog(
    items: List<OrderItem>,
    vendorName: String,
    onDismiss: () -> Unit,
    onRateOrder: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss, properties = DialogProperties(usePlatformDefaultWidth = false)) {
        Surface(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp)),
            color = Color.White
        ) {
            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxWidth(),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    "Rate Your Order",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = Primary
                )

                Spacer(modifier = Modifier.height(16.dp))

                items.forEach { item ->
                    var itemRating by remember { mutableIntStateOf(3) }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Image(
                            painter = rememberAsyncImagePainter(model = "${BuildConfig.BASE_URL}Product/get-product-image/${item.productId}"),
                            contentDescription = item.productName,
                            modifier = Modifier
                                .size(60.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.LightGray),
                            contentScale = ContentScale.Crop
                        )

                        Spacer(modifier = Modifier.width(20.dp))

                        Column(
                            verticalArrangement = Arrangement.Center
                        ) {
                            Text(item.productName, fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                            Spacer(modifier = Modifier.height(4.dp))

                            RatingBar(rating = itemRating, onRatingChange = { itemRating = it })
                        }
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                var vendorRating by remember { mutableIntStateOf(4) }
                Text(
                    "Rate the Vendor: $vendorName",
                    fontWeight = FontWeight.SemiBold,
                    fontSize = 16.sp
                )
                RatingBar(rating = vendorRating, onRatingChange = { vendorRating = it })

                Spacer(modifier = Modifier.height(16.dp))

                Text("Add a Comment", fontWeight = FontWeight.SemiBold, fontSize = 16.sp)
                ValidatedTextFieldComponent(
                    label = "Comment",
                    isRequired = false,
                    value = "",
                    onValueChange = {}
                )

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = {
                        onRateOrder()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Primary),
                    modifier = Modifier
                        .padding(vertical = 8.dp)
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Text("Submit", color = Color.White)
                }

                Button(
                    onClick = onDismiss,
                    colors = ButtonDefaults.buttonColors(containerColor = Color.LightGray),
                    modifier = Modifier
                        .padding(vertical = 8.dp)
                        .fillMaxWidth()
                        .height(50.dp)
                ) {
                    Text("Close", color = Color.White)
                }
            }
        }
    }
}

@Composable
fun RatingBar(
    rating: Int,
    onRatingChange: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(modifier = modifier) {
        for (i in 1..5) {
            val starIcon = if (i <= rating) Icons.Default.Star else Icons.Default.StarBorder

            Icon(
                imageVector = starIcon,
                contentDescription = "Star $i",
                modifier = Modifier
                    .size(24.dp)
                    .clickable { onRatingChange(i) },
                tint = Color(0xFFFFD700)
            )
        }
    }
}

@Preview
@Composable
fun OrderDetailsScreenPreview() {
    PreviewWrapper {
        OrderDetailsScreen(orderId = "0")
    }
}