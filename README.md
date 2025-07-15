# Jewelry Store - Razorpay Integration

A complete jewelry e-commerce application with Razorpay payment integration.

## Features

### Frontend
- ✅ Product catalog with cart functionality
- ✅ Dedicated cart page with quantity management
- ✅ Razorpay payment integration
- ✅ Order history and tracking
- ✅ User authentication (admin/user roles)
- ✅ Responsive design with Tailwind CSS

### Payment Flow
1. **Add to Cart**: Users can add jewelry items to cart
2. **Cart Management**: View, update quantities, remove items
3. **Checkout**: Fill customer information
4. **Payment**: Secure Razorpay payment processing
5. **Verification**: Backend payment verification
6. **Success**: Order confirmation and cart clearing

## Razorpay Integration

### Frontend Implementation
- **Cart Metadata**: Stores product IDs and quantities
- **Order Creation**: Creates Razorpay order with complete cart info
- **Payment Processing**: Uses Razorpay Checkout SDK
- **Payment Verification**: Verifies payment signature on backend

### Required Backend Endpoints

```
POST /order
- Creates Razorpay order with cart metadata
- Payload: { amount, currency, receipt, notes: { userId, name, email, phone, productIds, productCounts } }

POST /payment/verify  
- Verifies Razorpay payment signature
- Payload: { razorpay_order_id, razorpay_payment_id, razorpay_signature }

GET /orders/:orderId
- Retrieves order details with cart metadata

GET /orders/:orderId/payments
- Lists all payments for an order
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Add your Razorpay credentials:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
   VITE_API_BASE_URL=http://localhost:8000
   ```

## Installation

```bash
npm install
npm run dev
```

## Payment Testing

Use Razorpay test credentials:
- **Test Card**: 4111 1111 1111 1111
- **CVV**: Any 3 digits
- **Expiry**: Any future date

## Cart Metadata Storage

The system stores complete cart information with each order:
- Product IDs array
- Product quantities object
- User information (name, email, phone)
- Order amount and currency
- Payment status and details

This enables:
- Order tracking and history
- Inventory management
- Customer analytics
- Payment reconciliation

## Security Features

- Payment signature verification
- Secure API endpoints
- User authentication
- Input validation
- Error handling

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **Payment**: Razorpay
- **Icons**: Lucide React
- **Build Tool**: Vite