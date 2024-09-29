package com.example.markethub.screens.checkout

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.markethub.LocalNavController
import com.example.markethub.R
import com.example.markethub.screens.PreviewWrapper
import com.example.markethub.screens.cart.CartItem
import com.example.markethub.screens.cart.CartItemCard
import com.example.markethub.ui.theme.Primary

@Composable
fun CheckoutScreen(
    initialCartItems: List<CartItem> = sampleCheckoutItems()
) {
    val address = remember { mutableStateOf("") }
    val paymentType = remember { mutableStateOf("Cash on Delivery") }
    var cartItemsState by remember { mutableStateOf(initialCartItems) } // Use state to track cart items
    val totalPrice = cartItemsState.sumOf { it.price * it.quantity }
    val navController = LocalNavController.current
    var showDialog by remember { mutableStateOf(false) }
    var isSuccess by remember { mutableStateOf(true) }

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

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(cartItemsState.size) { index ->
                CartItemCard(
                    cartItem = cartItemsState[index],
                    onQuantityChange = { newQuantity ->
                        cartItemsState = cartItemsState.toMutableList().apply {
                            this[index] = this[index].copy(quantity = newQuantity)
                        }
                    },
                    onRemoveItem = {
                        cartItemsState = cartItemsState.toMutableList().apply { removeAt(index) }
                    }
                )
            }

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
                        text = "$${"%.2f".format(totalPrice)}",
                        fontSize = 24.sp,
                        fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                        color = Primary
                    )
                }

                Button(
                    onClick = {
                        showDialog = true
                        isSuccess = true
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
        CheckoutResultDialog(
            isSuccess = isSuccess,
            onDismiss = { showDialog = false },
            onButtonClick = { showDialog = false }
        )
    }
}

@Composable
fun AddressField(value: String, onValueChange: (String) -> Unit) {
    androidx.compose.material3.OutlinedTextField(
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

@Composable
fun sampleCheckoutItems(): List<CartItem> {
    return listOf(
        CartItem(
            id = 1,
            name = "Essentials Men's Short-Sleeve T-Shirt",
            imageRes = R.drawable.ic_placeholder,
            quantity = 2,
            price = 18.0
        ),
        CartItem(
            id = 2,
            name = "Comfort Fit Denim Jeans",
            imageRes = R.drawable.ic_placeholder,
            quantity = 1,
            price = 30.0
        ),
        CartItem(
            id = 3,
            name = "Slim Fit Polo Shirt",
            imageRes = R.drawable.ic_placeholder,
            quantity = 3,
            price = 22.0
        ),
        CartItem(
            id = 4,
            name = "Casual Leather Jacket",
            imageRes = R.drawable.ic_placeholder,
            quantity = 1,
            price = 65.0
        )
    )
}

@Preview
@Composable
fun CheckoutScreenPreview() {
    PreviewWrapper {
        CheckoutScreen()
    }
}
