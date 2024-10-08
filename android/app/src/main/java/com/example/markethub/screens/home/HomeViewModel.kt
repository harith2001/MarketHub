package com.example.markethub.screens.home

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
class HomeViewModel @Inject constructor(
    private val productRepository: ProductRepository
) : ViewModel() {

    // State for holding popular products
    private val _popularProducts = MutableStateFlow<List<Product>>(emptyList())
    val popularProducts: StateFlow<List<Product>> = _popularProducts

    // State for holding new arrivals
    private val _newArrivals = MutableStateFlow<List<Product>>(emptyList())
    val newArrivals: StateFlow<List<Product>> = _newArrivals

    // State for holding featured products
    private val _featuredProducts = MutableStateFlow<List<Product>>(emptyList())
    val featuredProducts: StateFlow<List<Product>> = _featuredProducts

    init {
        fetchProducts()
        fetchNewArrivals()
        fetchFeaturedProducts()
    }

    private fun fetchProducts() {
        viewModelScope.launch {
            val response = productRepository.getPopularProducts()
            if (response.isSuccessful) {
                response.body()?.let {
                    _popularProducts.value = it.shuffled().take(6)
                }
            }
        }
    }

    private fun fetchNewArrivals() {
        viewModelScope.launch {
            val response = productRepository.getNewArrivals()
            if (response.isSuccessful) {
                response.body()?.let {
                    _newArrivals.value = it.shuffled().take(6)
                }
            }
        }
    }

    private fun fetchFeaturedProducts() {
        viewModelScope.launch {
            val response = productRepository.getFeaturedProducts()
            if (response.isSuccessful) {
                response.body()?.let {
                    _featuredProducts.value = it.shuffled().take(6)
                }
            }
        }
    }
}
