# POS SYSTEM

## Modern Point of Sale System Built with MERN Stack

A comprehensive Inventory Management System (IMS) and Point of Sale (POS) system built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. This system provides a robust solution for managing sales, inventory, customers, and generating invoices.

## 🚀 Features

### Product Management

-   Add, edit, and delete products
-   Real-time product search functionality
-   Stock tracking with low stock alerts
-   Product categorization
-   Image support for products

### Cart & Sales

-   Intuitive cart interface
-   Smart quantity management (auto-increment for duplicate items)
-   Real-time price calculation
-   Easy product addition and removal
-   Quick checkout process

### Customer Management

-   Customer database with search functionality
-   Phone number formatting with "+880" prefix
-   Partial phone number search support
-   Customer history tracking
-   Address management

### Invoice Generation

-   Professional invoice generation
-   Automatic invoice numbering
-   Customer details integration
-   Itemized bill generation
-   Print-ready format

### User Interface

-   Modern, responsive design
-   Real-time search capabilities
-   Intuitive navigation
-   User-friendly forms
-   Clear feedback messages

## 🛠 Technology Stack

-   **Frontend**: React.js, Ant Design, Redux
-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **Authentication**: JWT
-   **API**: RESTful architecture

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

### Installation Steps

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Install server dependencies:

```bash
npm install
```

3. Install client dependencies:

```bash
cd client
npm install
```

4. Create .env file in root directory with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8080
```

5. Start the development servers:

For backend:

```bash
npm run server
```

For frontend:

```bash
cd client
npm start
```

## 📝 Usage

1. Register/Login to access the dashboard
2. Add products to your inventory
3. Manage customers
4. Create sales and generate invoices
5. Track your business performance

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-   Ant Design for the UI components
-   MongoDB Atlas for database hosting
-   The MERN stack community

## 📞 Support

For support, please open an issue in the repository or contact the maintainers.
