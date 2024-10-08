# MarketHub - E-commerce Platform

## Overview
MarketHub is an end-to-end e-commerce platform developed as part of the **SE4040 - Enterprise Application Development** module. This project implements a client-server architecture, featuring a **web application** for administrative and back-office tasks and a **mobile application** for customers. The system is built to handle user management, product management, order tracking, vendor management, and customer service.

## Team Details
- **IT21308284 - Vithanage H.D**
- **IT21291678 - Dehipola H. M. S. N**
- **IT21307430 - Chanthuka U.L.D**
- **IT21238512 - Soysa W.M.Y**

## Features

### Web Application
- **User Management**: 
  - Roles: Administrator, Vendor, and Customer Service Representative (CSR).
  - Administrator manages users and has access to product and inventory management functions.
- **Product Management**:
  - Vendors can create, update, and delete products using a unique Product ID.
  - Products can be activated/deactivated.
- **Order Management**:
  - Manage customer orders including creation, updating, and canceling.
  - Tracking the status of orders from processing to delivery.
- **Inventory Management**:
  - Manage stock levels and receive alerts for low stock.
- **Vendor Management**:
  - Vendor creation by Administrator.
  - Customer can rank and comment on vendors.
  
### Mobile Application
- **User Management**:
  - Customers can create accounts using email as a primary key.
  - CSR or Administrator activates accounts.
- **Product Browsing and Purchasing**:
  - Customers can search products, add to cart, place orders, and make payments.
- **Order Tracking**:
  - Customers can track the status of their orders and view history.
- **Vendor Ranking and Comments**:
  - Customers can rank and comment on vendors based on their experience.

### Web Service
- A centralized web service handles business logic and data processing for both the web and mobile applications.

## Technology Stack
- **Web Application**: React 
- **Mobile Application**: Android (Kotlin)
- **Web Service**: C# Web API
- **Database**: NoSQL (MongoDB)

## Project Structure
- **Web Application**: Provides interfaces for user, product, and order management.
- **Mobile Application**: Android app for customers to browse products, make purchases, and track orders.
- **Web Service**: Backend logic hosted on IIS, processing all requests from the web and mobile clients.

## Installation
1. Clone the repository:
   git clone https://github.com/harith2001/MarketHub.git
### Web Application
2. Navigate to the web app directory:
    cd markethub/web-app
3. Install dependencies:
    npm install
4. Start the development server:
    npm start

### Mobile Application
2. Open the mobile-app directory in Android Studio.
3. Build and run the application on an emulator or device.

### Mobile Application
2. Open the web-service directory in Visual Studio.
3. Add Mongodb URL in appsettings.json file.
4. Build and run the solution.

# Thank You !
