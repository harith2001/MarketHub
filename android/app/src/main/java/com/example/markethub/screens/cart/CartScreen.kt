package com.example.markethub.screens.cart

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.LocalNavController
import com.example.markethub.ui.theme.Primary

@Composable
fun CartScreen(viewModel: CartViewModel = hiltViewModel()) {
    val cartItemsState = viewModel.cartItems.collectAsState().value
    println("Cart Items: $cartItemsState")
    val navController = LocalNavController.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Start
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(imageVector = Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = Primary)
            }
            Text(text = "Your Cart", fontWeight = FontWeight.Bold, fontSize = 20.sp, modifier = Modifier.padding(start = 8.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(cartItemsState.size) { index ->
                CartItemCard(
                    cartItem = cartItemsState[index],
                    onQuantityChange = { newQuantity ->
                        viewModel.updateQuantity(cartItemsState[index].id, newQuantity)
                    },
                    onRemoveItem = {
                        viewModel.removeItem(cartItemsState[index].id)
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        val totalPrice = cartItemsState.sumOf { it.price * it.quantity }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(text = "Total", fontSize = 16.sp, color = Color.Gray)
                Text(
                    text = "$${"%.2f".format(totalPrice)}",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Primary
                )
            }
            Button(
                onClick = { navController.navigate("Checkout") },
                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .height(50.dp)
                    .width(150.dp)
            ) {
                Text(text = "Checkout", fontSize = 16.sp, color = Color.White)
            }
        }
    }
}