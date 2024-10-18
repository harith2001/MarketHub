package com.example.markethub.data.network

import android.content.Context
import com.example.markethub.data.database.CookieDbHelper
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl

class PersistentCookieJar(context: Context) : CookieJar {

    private val dbHelper = CookieDbHelper.getInstance(context)

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        val db = dbHelper.writableDatabase
        cookies.forEach { cookie ->
            db.execSQL(
                "INSERT INTO ${CookieDbHelper.TABLE_NAME} (${CookieDbHelper.COLUMN_NAME}, ${CookieDbHelper.COLUMN_VALUE}, " +
                        "${CookieDbHelper.COLUMN_DOMAIN}, ${CookieDbHelper.COLUMN_PATH}, ${CookieDbHelper.COLUMN_EXPIRY}) VALUES (?, ?, ?, ?, ?)",
                arrayOf(cookie.name, cookie.value, cookie.domain, cookie.path, cookie.expiresAt)
            )
        }
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        val cookies = mutableListOf<Cookie>()
        val db = dbHelper.readableDatabase
        val cursor = db.rawQuery(
            "SELECT * FROM ${CookieDbHelper.TABLE_NAME} WHERE ${CookieDbHelper.COLUMN_DOMAIN} = ?",
            arrayOf(url.host)
        )

        while (cursor.moveToNext()) {
            val name = cursor.getString(cursor.getColumnIndexOrThrow(CookieDbHelper.COLUMN_NAME))
            val value = cursor.getString(cursor.getColumnIndexOrThrow(CookieDbHelper.COLUMN_VALUE))
            val domain = cursor.getString(cursor.getColumnIndexOrThrow(CookieDbHelper.COLUMN_DOMAIN))
            val path = cursor.getString(cursor.getColumnIndexOrThrow(CookieDbHelper.COLUMN_PATH))
            val expiry = cursor.getLong(cursor.getColumnIndexOrThrow(CookieDbHelper.COLUMN_EXPIRY))

            val cookie = Cookie.Builder()
                .name(name)
                .value(value)
                .domain(domain)
                .path(path)
                .expiresAt(expiry)
                .build()

            if (expiry > System.currentTimeMillis()) {
                cookies.add(cookie)
            } else {
                deleteExpiredCookies(expiry)
            }
        }

        cursor.close()

        return cookies
    }

    private fun deleteExpiredCookies(expiry: Long) {
        val db = dbHelper.writableDatabase
        db.execSQL(
            "DELETE FROM ${CookieDbHelper.TABLE_NAME} WHERE ${CookieDbHelper.COLUMN_EXPIRY} < ?",
            arrayOf(expiry)
        )
    }

    fun clearCookies() {
        val db = dbHelper.writableDatabase
        db.execSQL("DELETE FROM ${CookieDbHelper.TABLE_NAME}")
    }
}
