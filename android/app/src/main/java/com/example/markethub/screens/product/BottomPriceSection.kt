package com.example.markethub.screens.product

import android.widget.Toast
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.markethub.domain.models.CartItem
import com.example.markethub.domain.models.Product
import com.example.markethub.screens.cart.CartViewModel
import com.example.markethub.ui.theme.Primary

@Composable
fun BottomPriceSection(
    price: String,
    product: Product,
    modifier: Modifier = Modifier,
    cartViewModel: CartViewModel = hiltViewModel()
) {
    var context = LocalContext.current
    var quantity by remember { mutableIntStateOf(1) }
    var showDialog by remember { mutableStateOf(false) }
    val vendorCheck = cartViewModel.hasDifferentVendorItems(product.vendor?.vendorId ?: "")

    Surface(
        tonalElevation = 8.dp,
        modifier = modifier
            .fillMaxWidth()
            .height(90.dp),
        color = Color.White
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Price Column
            Column {
                Text(text = "Price", color = Color.Gray, fontSize = 12.sp)
                Text(text = price, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Primary)
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Row(
                    modifier = Modifier
                        .height(45.dp)
                        .background(Color(0xFF00C569), shape = RoundedCornerShape(topStart = 8.dp, bottomStart = 8.dp)),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(
                        onClick = { if (quantity > 1) quantity-- },
                        enabled = quantity > 1,
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Remove,
                            contentDescription = "Decrease Quantity",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }

                    Text(
                        text = quantity.toString(),
                        modifier = Modifier.padding(horizontal = 4.dp),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    IconButton(
                        onClick = { quantity++ },
                        modifier = Modifier.size(28.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Increase Quantity",
                            tint = Color.White,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }

                Button(
                    onClick = {
                        if (vendorCheck) {
                            showDialog = true
                        } else {
                            cartViewModel.addItem(
                                CartItem(
                                    id = product.productId,
                                    name = product.productName,
                                    imageUrl = product.fullImageUrl ?: "",
                                    quantity = quantity,
                                    price = product.price,
                                    vendorId = product.vendor?.vendorId ?: ""
                                )
                            )
                            Toast.makeText(context, "Item added to cart", Toast.LENGTH_SHORT).show()
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF233142)),
                    shape = RoundedCornerShape(topEnd = 8.dp, bottomEnd = 8.dp),
                    modifier = Modifier
                        .height(45.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ShoppingCart,
                        contentDescription = "Cart Icon",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(text = "Add to Cart", color = Color.White)
                }
            }
        }
    }

    if (showDialog) {
        AlertDialog(
            onDismissRequest = { showDialog = false },
            confirmButton = {
                TextButton(onClick = {
                    showDialog = false
                    cartViewModel.clearCartAndAddItem(
                        CartItem(
                            id = product.productId,
                            name = product.productName,
                            imageUrl = product.fullImageUrl ?: "",
                            quantity = quantity,
                            price = product.price,
                            vendorId = product.vendor?.vendorId ?: ""
                        )
                    )
                    Toast.makeText(context, "Cart cleared and new item added", Toast.LENGTH_SHORT).show()
                }) {
                    Text("Confirm")
                }
            },
            dismissButton = {
                TextButton(onClick = { showDialog = false }) {
                    Text("Cancel")
                }
            },
            title = { Text("Clear Cart and Add New Item") },
            text = { Text("Your cart contains items from a different vendor. If you add this item, the cart will be cleared. Do you wish to continue?") }
        )
    }
}