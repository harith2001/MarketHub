package com.example.markethub.screens.favorites

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.markethub.data.local.FavoriteLocalDataSource
import com.example.markethub.domain.models.FavoriteItem
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class FavoritesViewModel @Inject constructor(
    private val favoriteLocalDataSource: FavoriteLocalDataSource
) : ViewModel() {

    private val _favoriteItems = MutableStateFlow<List<FavoriteItem>>(emptyList())
    val favoriteItems: StateFlow<List<FavoriteItem>> = _favoriteItems

    init {
        loadFavoriteItems()
    }

    fun loadFavoriteItems() {
        viewModelScope.launch {
            _favoriteItems.value = favoriteLocalDataSource.getFavoriteItems()
        }
    }

    fun addFavoriteItem(favoriteItem: FavoriteItem) {
        viewModelScope.launch {
            favoriteLocalDataSource.addOrUpdateFavoriteItem(favoriteItem)
            loadFavoriteItems()
        }
    }

    fun removeFavoriteItem(itemId: String) {
        viewModelScope.launch {
            favoriteLocalDataSource.removeFavoriteItem(itemId)
            loadFavoriteItems()
        }
    }

    fun clearFavorites() {
        viewModelScope.launch {
            favoriteLocalDataSource.clearFavorites()
            loadFavoriteItems()
        }
    }
}
