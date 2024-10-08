package com.example.markethub.data.local

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.example.markethub.domain.models.CartItem
import com.google.gson.Gson
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

val Context.cartDataStore by preferencesDataStore(name = "cart_data_store")

class CartDataStore(private val context: Context) {

    companion object {
        private val CART_ITEMS_KEY = stringPreferencesKey("cart_items")
    }

    private val gson = Gson()

    val cartItems: Flow<List<CartItem>> = context.cartDataStore.data
        .map { preferences ->
            val cartJson = preferences[CART_ITEMS_KEY]
            if (cartJson.isNullOrEmpty()) emptyList()
            else gson.fromJson(cartJson, Array<CartItem>::class.java).toList()
        }

    suspend fun updateCartItems(cartItems: List<CartItem>) {
        val cartJson = gson.toJson(cartItems)
        context.cartDataStore.edit { preferences ->
            preferences[CART_ITEMS_KEY] = cartJson
        }
    }
}
