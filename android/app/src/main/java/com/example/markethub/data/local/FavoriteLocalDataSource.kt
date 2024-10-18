package com.example.markethub.data.local

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import com.example.markethub.data.database.FavoriteDbHelper
import com.example.markethub.domain.models.FavoriteItem

class FavoriteLocalDataSource(context: Context) {

    private val dbHelper = FavoriteDbHelper.getInstance(context)

    fun getFavoriteItems(): List<FavoriteItem> {
        val favoriteItems = mutableListOf<FavoriteItem>()
        val db = dbHelper.readableDatabase
        val cursor = db.query(FavoriteDbHelper.TABLE_NAME, null, null, null, null, null, null)

        while (cursor.moveToNext()) {
            val id = cursor.getString(cursor.getColumnIndexOrThrow(FavoriteDbHelper.COLUMN_ID))
            val name = cursor.getString(cursor.getColumnIndexOrThrow(FavoriteDbHelper.COLUMN_NAME))
            val imageUrl = cursor.getString(cursor.getColumnIndexOrThrow(FavoriteDbHelper.COLUMN_IMAGE_URL))
            val price = cursor.getDouble(cursor.getColumnIndexOrThrow(FavoriteDbHelper.COLUMN_PRICE))

            favoriteItems.add(FavoriteItem(id, name, imageUrl, price))
        }
        cursor.close()
        return favoriteItems
    }

    fun addOrUpdateFavoriteItem(favoriteItem: FavoriteItem) {
        val db = dbHelper.writableDatabase
        val contentValues = ContentValues().apply {
            put(FavoriteDbHelper.COLUMN_ID, favoriteItem.id)
            put(FavoriteDbHelper.COLUMN_NAME, favoriteItem.name)
            put(FavoriteDbHelper.COLUMN_IMAGE_URL, favoriteItem.image)
            put(FavoriteDbHelper.COLUMN_PRICE, favoriteItem.price)
        }

        db.insertWithOnConflict(FavoriteDbHelper.TABLE_NAME, null, contentValues, SQLiteDatabase.CONFLICT_REPLACE)
    }

    fun removeFavoriteItem(itemId: String) {
        val db = dbHelper.writableDatabase
        db.delete(FavoriteDbHelper.TABLE_NAME, "${FavoriteDbHelper.COLUMN_ID} = ?", arrayOf(itemId))
    }

    fun clearFavorites() {
        val db = dbHelper.writableDatabase
        db.execSQL("DELETE FROM ${FavoriteDbHelper.TABLE_NAME}")
    }
}
