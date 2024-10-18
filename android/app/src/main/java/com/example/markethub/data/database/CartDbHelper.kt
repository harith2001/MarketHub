package com.example.markethub.data.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class CartDbHelper private constructor(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "cart.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_NAME = "cart"
        const val COLUMN_ID = "id"
        const val COLUMN_NAME = "name"
        const val COLUMN_VENDOR_ID = "vendor_id"
        const val COLUMN_IMAGE_URL = "image_url"
        const val COLUMN_QUANTITY = "quantity"
        const val COLUMN_PRICE = "price"

        private const val SQL_CREATE_TABLE = """
            CREATE TABLE $TABLE_NAME (
                $COLUMN_ID TEXT PRIMARY KEY,
                $COLUMN_NAME TEXT,
                $COLUMN_VENDOR_ID TEXT,
                $COLUMN_IMAGE_URL TEXT,
                $COLUMN_QUANTITY INTEGER,
                $COLUMN_PRICE REAL
            )
        """

        @Volatile
        private var instance: CartDbHelper? = null

        fun getInstance(context: Context): CartDbHelper {
            return instance ?: synchronized(this) {
                instance ?: CartDbHelper(context.applicationContext).also { instance = it }
            }
        }
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(SQL_CREATE_TABLE)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }
}
