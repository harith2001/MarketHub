package com.example.markethub.data.database

import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class UserDbHelper private constructor(context: Context) : SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "user.db"
        private const val DATABASE_VERSION = 1

        const val TABLE_NAME = "user"
        const val COLUMN_ID = "id"
        const val COLUMN_NAME = "name"
        const val COLUMN_EMAIL = "email"
        const val COLUMN_IS_ACTIVE = "is_active"

        private const val SQL_CREATE_TABLE = """
            CREATE TABLE $TABLE_NAME (
                $COLUMN_ID TEXT PRIMARY KEY,
                $COLUMN_NAME TEXT,
                $COLUMN_EMAIL TEXT,
                $COLUMN_IS_ACTIVE INTEGER
            )
        """

        @Volatile
        private var instance: UserDbHelper? = null

        fun getInstance(context: Context): UserDbHelper {
            return instance ?: synchronized(this) {
                instance ?: UserDbHelper(context.applicationContext).also { instance = it }
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

    fun clearUserData() {
        writableDatabase.execSQL("DELETE FROM $TABLE_NAME")
    }
}
