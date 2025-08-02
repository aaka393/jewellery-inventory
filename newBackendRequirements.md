# Half Payment Flow - Backend Requirements

## New API Endpoints Required

### 1. Order Management Endpoints

#### Enable Remaining Payment
```
POST /admin/orders/{orderId}/enable-remaining-payment
```
**Purpose**: Enable remaining payment option for half-paid orders after tracking ID is sent
**Request Body**: Empty `{}`
**Response**: 
```json
{
  "code": 10000,
  "message": "Remaining payment enabled successfully",
  "success": true,
  "result": {
    "orderId": "order_123",
    "enableRemainingPayment": true
  }
}
```

#### Send Remaining Payment Notification
```
POST /admin/orders/{orderId}/send-remaining-payment-notification
```
**Purpose**: Send notification to user about remaining payment availability
**Request Body**: Empty `{}`
**Response**:
```json
{
  "code": 10000,
  "message": "Remaining payment notification sent successfully",
  "success": true,
  "result": {
    "orderId": "order_123",
    "notificationSent": true,
    "userEmail": "user@example.com"
  }
}
```

#### Create Remaining Payment Order
```
POST /orders/remaining-payment
```
**Purpose**: Create a new Razorpay order for remaining payment
**Request Body**:
```json
{
  "originalOrderId": "order_123",
  "amount": 50000,
  "currency": "INR"
}
```
**Response**:
```json
{
  "code": 1000,
  "message": "Remaining payment order created",
  "success": true,
  "result": {
    "id": "order_remaining_456",
    "amount": 50000,
    "currency": "INR",
    "originalOrderId": "order_123"
  }
}
```

#### Verify Remaining Payment
```
POST /payments/verify-remaining
```
**Purpose**: Verify remaining payment and update original order status
**Request Body**:
```json
{
  "razorpay_order_id": "order_remaining_456",
  "razorpay_payment_id": "pay_789",
  "razorpay_signature": "signature_hash",
  "originalOrderId": "order_123"
}
```
**Response**:
```json
{
  "code": 1000,
  "message": "Remaining payment verified successfully",
  "success": true,
  "result": {
    "status": "success",
    "originalOrderId": "order_123",
    "halfPaymentStatus": "paid"
  }
}
```

## Database Schema Updates

### Orders Collection Updates
```javascript
{
  // Existing fields...
  isHalfPayment: Boolean, // Existing field
  isHalfPaid: Boolean, // New field for 50% payment option
  remainingAmount: Number, // Existing field
  halfPaymentStatus: String, // 'pending', 'paid', 'not_applicable'
  enableRemainingPayment: Boolean, // New field - enables "Pay Remaining" button
  paymentType: String, // 'full', 'half', 'custom' - tracks payment choice
  originalAmount: Number, // Store original full amount
  paidAmount: Number, // Amount actually paid
  remainingPaymentOrderId: String, // Razorpay order ID for remaining payment
  remainingPaymentId: String, // Razorpay payment ID for remaining payment
  remainingPaymentDate: Date, // When remaining payment was completed
  trackingIdSentAt: Date, // When tracking ID was sent (triggers remaining payment)
}
```

### Products Collection Updates
```javascript
{
  // Existing fields...
  isHalfPaymentAvailable: Boolean, // Existing - custom half payment with specific amount
  halfPaymentAmount: Number, // Existing - specific amount for first payment
  isHalfPayment: Boolean, // New - simple 50% payment option
  paymentOptions: {
    allowHalfPayment: Boolean, // New - 50% option
    allowCustomHalfPayment: Boolean, // Existing functionality
    customHalfPaymentAmount: Number, // Existing functionality
  }
}
```

### Notifications Collection (New)
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  orderId: ObjectId,
  type: String, // 'remaining_payment_available', 'tracking_sent', etc.
  title: String,
  message: String,
  isRead: Boolean,
  actionUrl: String, // URL to redirect when clicked
  createdAt: Date,
  expiresAt: Date, // Optional expiration
  metadata: Object // Additional data
}
```

## Business Logic Requirements

### 1. Order Creation Logic
- When `paymentType: 'half'` is selected:
  - Set `isHalfPaid: true`
  - Set `paidAmount: amount * 0.5`
  - Set `remainingAmount: amount * 0.5`
  - Set `halfPaymentStatus: 'pending'`
  - Set `enableRemainingPayment: false` (initially disabled)

### 2. Tracking ID Flow
- When admin sends tracking ID for half-paid order:
  - Update order with tracking number
  - Set `enableRemainingPayment: true`
  - Set `trackingIdSentAt: new Date()`
  - Create notification for user
  - Send email notification (optional)

### 3. Remaining Payment Flow
- User can only pay remaining amount if:
  - `isHalfPaid: true` OR `isHalfPayment: true`
  - `halfPaymentStatus: 'pending'`
  - `enableRemainingPayment: true`
  - `trackingNumber` exists

### 4. Payment Verification
- For remaining payments:
  - Verify Razorpay signature
  - Update original order:
    - `halfPaymentStatus: 'paid'`
    - `remainingPaymentId: payment_id`
    - `remainingPaymentDate: new Date()`
    - `paidAmount: originalAmount` (full amount now paid)

## Email Templates Required

### 1. Tracking ID Notification
**Subject**: Your Order is Being Shipped - Complete Your Payment
**Content**: 
- Order details
- Tracking number
- Remaining payment amount
- Payment link
- Delivery timeline

### 2. Remaining Payment Reminder
**Subject**: Complete Your Payment - Order #{orderId}
**Content**:
- Payment deadline
- Remaining amount
- Consequences of non-payment
- Payment link

## API Response Codes

```javascript
// Success Codes
REMAINING_PAYMENT_ENABLED: 10001,
REMAINING_PAYMENT_NOTIFICATION_SENT: 10002,
REMAINING_PAYMENT_ORDER_CREATED: 10003,
REMAINING_PAYMENT_VERIFIED: 10004,

// Error Codes
REMAINING_PAYMENT_NOT_ELIGIBLE: 20001,
REMAINING_PAYMENT_ALREADY_ENABLED: 20002,
REMAINING_PAYMENT_ALREADY_PAID: 20003,
TRACKING_ID_REQUIRED: 20004,
INVALID_REMAINING_PAYMENT_ORDER: 20005,
```

## Security Considerations

1. **User Authorization**: Only order owner can pay remaining amount
2. **Admin Authorization**: Only admins can enable remaining payments
3. **Payment Verification**: Strict signature verification for remaining payments
4. **Rate Limiting**: Limit remaining payment attempts
5. **Expiration**: Optional expiration for remaining payment links

## Notification System

### Real-time Notifications
- WebSocket connection for real-time updates
- Push notifications for mobile apps
- Email notifications for critical actions

### Notification Types
1. `REMAINING_PAYMENT_AVAILABLE` - When admin enables remaining payment
2. `TRACKING_ID_SENT` - When tracking ID is provided
3. `PAYMENT_REMINDER` - Periodic reminders for pending payments
4. `PAYMENT_DEADLINE` - Final reminder before order cancellation

## Testing Requirements

### Unit Tests
- Payment calculation logic
- Order status transitions
- Notification creation
- Email sending

### Integration Tests
- Complete half payment flow
- Razorpay integration
- Email delivery
- Database consistency

### Edge Cases
- Multiple remaining payment attempts
- Order cancellation scenarios
- Payment failures
- Network interruptions

## Performance Considerations

1. **Database Indexing**:
   - Index on `enableRemainingPayment: true`
   - Index on `halfPaymentStatus: 'pending'`
   - Compound index on `userId + halfPaymentStatus`

2. **Caching**:
   - Cache user notification counts
   - Cache pending payment orders
   - Cache payment verification results

3. **Background Jobs**:
   - Periodic cleanup of expired notifications
   - Automated payment reminders
   - Order status synchronization

## Monitoring & Analytics

1. **Metrics to Track**:
   - Half payment adoption rate
   - Remaining payment completion rate
   - Average time between tracking and payment
   - Payment failure rates

2. **Alerts**:
   - High remaining payment failure rate
   - Unusual payment patterns
   - System errors in payment flow

This implementation provides a complete half payment system with proper user experience, admin controls, and robust backend requirements.