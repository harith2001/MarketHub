package com.example.markethub.data.local

import android.content.Context
import com.example.markethub.data.database.UserDbHelper
import com.example.markethub.domain.models.User

class UserLocalDataSource(context: Context) {

    private val dbHelper = UserDbHelper.getInstance(context)

    fun saveUser(user: User) {
        val db = dbHelper.writableDatabase
        db.execSQL(
            "INSERT OR REPLACE INTO ${UserDbHelper.TABLE_NAME} (${UserDbHelper.COLUMN_ID}, " +
                    "${UserDbHelper.COLUMN_NAME}, ${UserDbHelper.COLUMN_EMAIL}, ${UserDbHelper.COLUMN_IS_ACTIVE}) " +
                    "VALUES (?, ?, ?, ?)",
            arrayOf(user.userId, user.name, user.email, user.isActive)
        )
    }

    fun getUser(): User? {
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery("SELECT * FROM ${UserDbHelper.TABLE_NAME} LIMIT 1", null)
        var user: User? = null

        if (cursor.moveToFirst()) {
            val id = cursor.getString(cursor.getColumnIndexOrThrow(UserDbHelper.COLUMN_ID))
            val name = cursor.getString(cursor.getColumnIndexOrThrow(UserDbHelper.COLUMN_NAME))
            val email = cursor.getString(cursor.getColumnIndexOrThrow(UserDbHelper.COLUMN_EMAIL))
            val isActive = cursor.getInt(cursor.getColumnIndexOrThrow(UserDbHelper.COLUMN_IS_ACTIVE)) == 1
            user = User(id, name, email, isActive)
        }

        cursor.close()
        return user
    }

    fun clearUserData() {
        dbHelper.clearUserData()
    }
}
