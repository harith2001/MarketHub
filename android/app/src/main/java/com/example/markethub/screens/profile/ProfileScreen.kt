package com.example.markethub.screens.profile

import android.content.Context
import android.graphics.Bitmap
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.example.markethub.LocalNavController
import com.example.markethub.R
import com.example.markethub.components.PasswordField
import com.example.markethub.components.ValidatedTextFieldComponent
import com.example.markethub.extensions.isValidEmail
import com.example.markethub.screens.auth.saveSignInState
import com.example.markethub.ui.theme.Primary

@Composable
fun ProfileScreen(viewModel: ProfileViewModel = hiltViewModel()) {
    val context = LocalContext.current
    val user by viewModel.user.collectAsStateWithLifecycle()
    val updateStatus by viewModel.updateStatus.collectAsStateWithLifecycle()
    val errorMessage by viewModel.errorMessage.collectAsStateWithLifecycle()

    var userName by remember { mutableStateOf("") }
    var userEmail by remember { mutableStateOf("") }

    var existingPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }

    // Populate fields when the user data is loaded
    LaunchedEffect(user) {
        user?.let {
            userName = it.name
            userEmail = it.email
        }
    }

    LaunchedEffect(updateStatus) {
        if (updateStatus == true) {
            Toast.makeText(context, "Profile updated successfully", Toast.LENGTH_SHORT).show()
            viewModel.resetUpdateStatus()
        }
    }

    LaunchedEffect(errorMessage) {
        errorMessage?.let {
            Toast.makeText(context, it, Toast.LENGTH_SHORT).show()
            viewModel.clearErrorMessage()
        }
    }

    var profilePictureUri by remember { mutableStateOf<Uri?>(null) }
    var profileBitmap by remember { mutableStateOf<Bitmap?>(null) }

    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        profilePictureUri = uri
        profileBitmap = uri?.let {
            if (Build.VERSION.SDK_INT < 28) {
                @Suppress("DEPRECATION")
                android.provider.MediaStore.Images.Media.getBitmap(context.contentResolver, it)
            } else {
                val source = ImageDecoder.createSource(context.contentResolver, it)
                ImageDecoder.decodeBitmap(source)
            }
        }
    }

    val navController = LocalNavController.current

    Surface(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color.White)
                .verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                modifier = Modifier.size(120.dp),
                contentAlignment = Alignment.BottomEnd
            ) {
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .border(1.dp, Primary, CircleShape)
                        .clickable { launcher.launch("image/*") },
                    contentAlignment = Alignment.Center
                ) {
                    if (profileBitmap != null) {
                        androidx.compose.foundation.Image(
                            bitmap = profileBitmap!!.asImageBitmap(),
                            contentDescription = "Profile Picture",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(120.dp)
                                .clip(CircleShape)
                        )
                    } else {
                        Icon(
                            painter = painterResource(id = R.drawable.ic_default_profile_update),
                            contentDescription = "Default Profile Picture",
                            modifier = Modifier.size(120.dp),
                            tint = Primary
                        )
                    }
                }

                Icon(
                    imageVector = Icons.Filled.CameraAlt,
                    contentDescription = "Change Profile Picture",
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(Color.White)
                        .padding(4.dp)
                        .clickable { launcher.launch("image/*") },
                    tint = Primary
                )
            }

            ValidatedTextFieldComponent(
                label = "Name",
                isRequired = true,
                validationRules = listOf(
                    { input -> if (input.length < 2) "Name should be at least 2 characters" else null },
                    { input -> if (input.any { it.isDigit() }) "Name should not contain numbers" else null },
                    { input -> if (input.any { !it.isLetter() }) "Name should contain only letters" else null }
                ),
                value = userName,
                onValueChange = { userName = it }
            )
            ValidatedTextFieldComponent(
                label = "Email",
                isRequired = true,
                validationRules = listOf { input -> if (!input.isValidEmail()) "Invalid email address format" else null },
                value = userEmail,
                onValueChange = { userEmail = it }
            )

            Button(
                onClick = { viewModel.updateUserProfile(user?.userId ?: "", userName, userEmail, user?.isActive ?: false) },
                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = CircleShape
            ) {
                Text(text = "Update Profile", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }

            HorizontalDivider(thickness = 1.dp, color = Color.Gray.copy(alpha = 0.2f))
            Text("Change Password", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            PasswordField(
                label = "Existing Password",
                isRequired = true,
                minLength = 6,
                disableValidation = true,
                value = existingPassword,
                onValueChange = { existingPassword = it }
            )
            PasswordField(
                label = "New Password",
                isRequired = true,
                minLength = 6,
                value = newPassword,
                onValueChange = { newPassword = it }
            )
            PasswordField(
                label = "Confirm Password",
                isRequired = true,
                minLength = 6,
                value = confirmPassword,
                onValueChange = { confirmPassword = it }
            )
            Button(
                onClick = { viewModel.changePassword(user?.userId ?: "", existingPassword, newPassword, confirmPassword, context) },
                colors = ButtonDefaults.buttonColors(containerColor = Primary),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = CircleShape
            ) {
                Text(text = "Change Password", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }

            HorizontalDivider(thickness = 1.dp, color = Color.Gray.copy(alpha = 0.2f))
            //logout button
            Button(
                onClick = { viewModel.signOut(navController, context) },
                colors = ButtonDefaults.buttonColors(containerColor = Color.Gray),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = CircleShape
            ) {
                Text(text = "Logout", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
            Button(
                onClick = { viewModel.deactivateAccount(user?.userId ?: "", userName, userEmail, navController, context) },
                colors = ButtonDefaults.buttonColors(containerColor = Color.Red),
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = CircleShape
            ) {
                Text(text = "Deactivate Account", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    ProfileScreen()
}