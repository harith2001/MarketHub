package com.example.markethub.screens.checkout

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.LocalNavController
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.screens.cart.CartItemCard
import com.example.markethub.screens.cart.CartViewModel
import com.example.markethub.ui.theme.Primary

@Composable
fun CheckoutScreen(
    viewModel: CartViewModel = hiltViewModel(),
) {
    val cartItems by viewModel.cartItems.collectAsState()
    val address = remember { mutableStateOf("") }
    val note = remember { mutableStateOf("") }
    val paymentType = remember { mutableStateOf("Cash on Delivery") }
    val totalPrice = cartItems.sumOf { it.price * it.quantity }
    val navController = LocalNavController.current
    var showDialog by remember { mutableStateOf(false) }
    val orderResponse by viewModel.orderResponse.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // Top Bar with Back Button
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
            Text(
                text = "Checkout",
                fontSize = 20.sp,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                modifier = Modifier.padding(start = 8.dp)
            )
        }

        // Cart Items List
        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(cartItems.size) { index ->
                CartItemCard(
                    cartItem = cartItems[index],
                    onQuantityChange = { newQuantity ->
                        viewModel.updateQuantity(cartItems[index].id, newQuantity)
                    },
                    onRemoveItem = {
                        viewModel.removeItem(cartItems[index].id)
                    }
                )
            }

            // Delivery Address Field
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Delivery Address",
                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                    fontSize = 18.sp
                )
                AddressField(
                    value = address.value,
                    onValueChange = { address.value = it }
                )
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Note",
                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                    fontSize = 18.sp
                )
                OutlinedTextField(
                    value = note.value,
                    onValueChange = { note.value = it },
                    label = { Text(text = "Enter Note") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp)
                )
            }

            // Payment Method Selector
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "Payment Method",
                    fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                    fontSize = 18.sp
                )
                PaymentTypeSelector(
                    selectedType = paymentType.value,
                    onTypeSelected = { paymentType.value = it }
                )
            }
        }

        // Bottom Price Section with Total and Place Order Button
        Surface(
            tonalElevation = 8.dp,
            modifier = Modifier
                .fillMaxWidth()
                .height(100.dp),
            color = Color.White
        ) {
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(text = "Total Price", color = Color.Gray, fontSize = 14.sp)
                    Text(
                        text = "Rs.${"%.2f".format(totalPrice)}",
                        fontSize = 24.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                        color = Primary
                    )
                }

                Button(
                    onClick = {
                        viewModel.createOrder(
                            cartItems = cartItems,
                            totalPrice = totalPrice,
                            note = note.value,
                            shippingAddress = address.value,
                            paymentMethod = paymentType.value
                        )
                        showDialog = true
                    },
                    modifier = Modifier
                        .height(50.dp)
                        .width(150.dp)
                        .clip(RoundedCornerShape(8.dp)),
                    colors = ButtonDefaults.buttonColors(containerColor = Primary)
                ) {
                    Text(text = "Place Order", fontSize = 16.sp, color = Color.White)
                }
            }
        }
    }

    if (showDialog) {
        orderResponse?.let { response ->
            if (response.isSuccessful) {
                CheckoutResultDialog(
                    isSuccess = true,
                    onDismiss = { showDialog = false },
                    onButtonClick = {
                        showDialog = false
                        navController.popBackStack()
                        viewModel.clearOrderResponse()
                    }
                )
            } else {
                CheckoutResultDialog(
                    isSuccess = false,
                    onDismiss = { showDialog = false },
                    onButtonClick = {
                        showDialog = false
                        viewModel.clearOrderResponse()
                    }
                )
            }
        }
    }
}

@Composable
fun AddressField(value: String, onValueChange: (String) -> Unit) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(text = "Enter Address") },
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    )
}

@Composable
fun PaymentTypeSelector(selectedType: String, onTypeSelected: (String) -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp)
                .clickable { onTypeSelected("Cash on Delivery") }
        ) {
            RadioButton(
                selected = selectedType == "Cash on Delivery",
                onClick = { onTypeSelected("Cash on Delivery") }
            )
            Text(text = "Cash on Delivery", modifier = Modifier.padding(start = 8.dp))
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 4.dp)
                .clickable { onTypeSelected("Online Payment") }
        ) {
            RadioButton(
                selected = selectedType == "Online Payment",
                onClick = { onTypeSelected("Online Payment") }
            )
            Text(text = "Online Payment", modifier = Modifier.padding(start = 8.dp))
        }
    }
}

@Preview
@Composable
fun CheckoutScreenPreview() {
    PreviewWrapper {
        CheckoutScreen()
    }
}
