package com.example.markethub.data.local

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import com.example.markethub.data.database.CartDbHelper
import com.example.markethub.domain.models.CartItem

class CartLocalDataSource(context: Context) {

    private val dbHelper = CartDbHelper.getInstance(context)

    fun getCartItems(): List<CartItem> {
        val cartItems = mutableListOf<CartItem>()
        val db = dbHelper.readableDatabase
        val cursor = db.query(CartDbHelper.TABLE_NAME, null, null, null, null, null, null)

        while (cursor.moveToNext()) {
            val id = cursor.getString(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_ID))
            val name = cursor.getString(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_NAME))
            val vendorId = cursor.getString(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_VENDOR_ID))
            val imageUrl = cursor.getString(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_IMAGE_URL))
            val quantity = cursor.getInt(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_QUANTITY))
            val price = cursor.getDouble(cursor.getColumnIndexOrThrow(CartDbHelper.COLUMN_PRICE))

            cartItems.add(CartItem(id, name, vendorId, imageUrl, quantity, price))
        }
        cursor.close()
        return cartItems
    }

    fun addOrUpdateCartItem(cartItem: CartItem) {
        val db = dbHelper.writableDatabase
        val contentValues = ContentValues().apply {
            put(CartDbHelper.COLUMN_ID, cartItem.id)
            put(CartDbHelper.COLUMN_NAME, cartItem.name)
            put(CartDbHelper.COLUMN_VENDOR_ID, cartItem.vendorId)
            put(CartDbHelper.COLUMN_IMAGE_URL, cartItem.imageUrl)
            put(CartDbHelper.COLUMN_QUANTITY, cartItem.quantity)
            put(CartDbHelper.COLUMN_PRICE, cartItem.price)
        }

        db.insertWithOnConflict(CartDbHelper.TABLE_NAME, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun updateCartItemQuantity(productId: String, quantity: Int) {
        val db = dbHelper.writableDatabase
        val contentValues = ContentValues().apply {
            put(CartDbHelper.COLUMN_QUANTITY, quantity)
        }

        db.update(CartDbHelper.TABLE_NAME, contentValues, "${CartDbHelper.COLUMN_ID} = ?", arrayOf(productId))
    }

    fun removeCartItem(productId: String) {
        val db = dbHelper.writableDatabase
        db.delete(CartDbHelper.TABLE_NAME, "${CartDbHelper.COLUMN_ID} = ?", arrayOf(productId))
    }

    fun clearCart() {
        val db = dbHelper.writableDatabase
        db.execSQL("DELETE FROM ${CartDbHelper.TABLE_NAME}")
    }
}
