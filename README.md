
# Pharma X - Pharmacy Management System

Welcome to the Pharma X repository. This project is a comprehensive pharmacy management system developed using Vite, React, and Firebase. It is designed to streamline pharmacy operations by providing powerful tools for invoice management, customer management, and an admin panel for user management.

## Features

### Invoice Management
- Create and manage invoices.
- Automatically calculates totals and maintains a running tally of invoice items.

### Customer Management
- Manage customer information with the ability to add, update, and delete customer records.
- Enhanced search functionality to quickly retrieve customer details.

### Admin Panel
- Comprehensive user management capabilities to handle user roles such as Admin, Pharmacist, and Pharmacist Technician.
- Role-based access control to ensure each user has the appropriate permissions.

## Technology Stack
- **Frontend:** React.js (Vite)
- **Backend:** Firebase
- **Authentication:** Firebase Auth
- **Database:** Firestore

## Setup

### Prerequisites
- Node.js
- npm or yarn
- A Firebase account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SahandMohammed/pharma-x.git
   ```
2. Navigate to the project client directory:
   ```bash
   cd pharma-x/client
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

### Configuration
1. Set up your Firebase project and get your configuration keys.
2. Create a `.env` file in the project root and fill it with your Firebase keys:
   ```
   VITE_API_KEY=your_api_key
   VITE_AUTH_DOMAIN=your_auth_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_app_id
   ```

### Running the Application
To start the application locally, run:
```bash
npm run dev
```
or
```bash
yarn dev
```

This will start the local development server and open the application in your default web browser.
