package com.example.markethub.extensions

fun String.isValidEmail(): Boolean {
    val emailPattern = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"
    return Regex(emailPattern).matches(this)
}