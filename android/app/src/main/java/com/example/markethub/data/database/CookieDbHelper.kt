package com.example.markethub.data.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class CookieDbHelper(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "cookies.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_NAME = "cookies"
        const val COLUMN_ID = "id"
        const val COLUMN_NAME = "name"
        const val COLUMN_VALUE = "value"
        const val COLUMN_DOMAIN = "domain"
        const val COLUMN_PATH = "path"
        const val COLUMN_EXPIRY = "expiry"

        private const val SQL_CREATE_TABLE = """
            CREATE TABLE $TABLE_NAME (
                $COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT,
                $COLUMN_NAME TEXT,
                $COLUMN_VALUE TEXT,
                $COLUMN_DOMAIN TEXT,
                $COLUMN_PATH TEXT,
                $COLUMN_EXPIRY INTEGER
            )
        """
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL(SQL_CREATE_TABLE)
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        db.execSQL("DROP TABLE IF EXISTS $TABLE_NAME")
        onCreate(db)
    }
}
