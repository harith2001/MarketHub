package com.example.markethub.screens.product

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.domain.models.Product
import com.example.markethub.domain.repository.ProductRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProductFilterViewModel @Inject constructor(
    private val productRepository: ProductRepository
) : ViewModel() {
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    fun getProductsByCategory(category: String) {
        viewModelScope.launch {
            _isLoading.value = true
            val response = productRepository.getProductsByCategory(category)
            if (response.isSuccessful) {
                response.body()?.let {
                    _products.value = it
                }
            }
            _isLoading.value = false
        }
    }

    fun searchProducts(query: String) {
        viewModelScope.launch {
            _isLoading.value = true
            val response = productRepository.searchProducts(query)
            if (response.isSuccessful) {
                response.body()?.let {
                    _products.value = it
                }
            }
            _isLoading.value = false
        }
    }

    fun getProducts() {
        viewModelScope.launch {
            _isLoading.value = true
            val response = productRepository.getProducts()
            if (response.isSuccessful) {
                response.body()?.let {
                    _products.value = it
                }
            }
            _isLoading.value = false
        }
    }
}