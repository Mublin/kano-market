# kano-market
## E-Commerce Website - React, Node.js, MongoDB, useContext API, Cloudinary, and PayPal Payment Gateway

![E-Commerce Website]

This is an E-Commerce web application built using React on the frontend and Node.js, Express, and MongoDB on the backend. The application utilizes the useContext API for state management, Cloudinary for image hosting, and the PayPal payment gateway for secure payments.

## Features

- User authentication and registration
- Product catalog with categories and search functionality
- Shopping cart management
- Secure checkout with PayPal integration
- Image upload using Cloudinary for product listings
- User dashboard to manage orders and account details

## Prerequisites

Before running the application locally, ensure you have the following installed:

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account for image hosting
- PayPal sandbox account for payment testing

## Installation

1. Clone the repository from GitHub.

```bash
git clone <repository_link.git>
cd e-commerce-website
```

2. Install dependencies for both frontend and backend.

```bash
# Install frontend and backend dependencies
npm install
cd frontend
npm install
cd ../backend
npm install
```

3. Set up MongoDB

Make sure MongoDB is running on your system.

4. Configuration

Create a `.env` file in the `backend` directory and configure the following environment variables:

```env
PORT=3000                     # The port on which the backend server will run
DATABASE_URL=mongodb://localhost:27017/<database_name>  # MongoDB connection URL
CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>    # Cloudinary cloud name
CLOUDINARY_API_KEY=<cloudinary_api_key>          # Cloudinary API key
CLOUDINARY_API_SECRET=<cloudinary_api_secret>    # Cloudinary API secret
PAYPAL_CLIENT_ID=<paypal_client_id>              # PayPal sandbox client ID
```

Replace `<database_name>` with the name of the database you want to use, `<cloudinary_cloud_name>`, `<cloudinary_api_key>`, and `<cloudinary_api_secret>` with your Cloudinary account details, and `<paypal_client_id>` with your PayPal sandbox client ID.

## Running the Application

In the root directory of the project (e-commerce-website), run the following command:

```bash
npm start
```

This command will use `concurrently` to start both the frontend and backend development servers concurrently. The frontend server will run on `http://localhost:3000`, and the backend server will run on `http://localhost:3001`.

## Tech Stack

### Frontend

- React
- useContext API for state management
- Axios (for API requests)
- Cloudinary React SDK (for image upload)

### Backend

- Node.js
- Express
- MongoDB (with Mongoose as the ODM)
- Cloudinary Node.js SDK (for image management)
- PayPal REST API (for payment processing)

## Folder Structure

```
e-commerce-website/
|-- backend/       # Backend server code
|   |-- controllers/
|   |-- models/
|   |-- routes/
|   |-- config/
|   |-- index.js
|   |-- .env
|-- frontend/      # Frontend code
|   |-- public/
|   |-- src/
|   |-- package.json
|   |-- .env
|-- .gitignore
|-- README.md
|-- package.json
```

## Contribution Guidelines

If you want to contribute to this project, please follow the guidelines in the CONTRIBUTING.md file. Create a pull request with your proposed changes and wait for code review before merging.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Thanks to Cloudinary and PayPal for providing the services used in this project, and to the open-source community for providing valuable tools and libraries that made this project possible.

By following the steps above, you should be able to run both the frontend and backend concurrently for the E-Commerce Website.
