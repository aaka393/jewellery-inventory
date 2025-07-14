# Backend Requirements for Virtual Try-On Jewellery App

## Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT tokens
- **File Storage**: AWS S3 or local storage
- **Image Processing**: OpenCV, PIL, or similar
- **Payment**: Stripe/Razorpay integration
- **File Processing**: pandas, openpyxl for Excel/CSV handling

## Database Schema (MongoDB Collections)

### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  mobile: String (unique),
  firstName: String,
  lastName: String,
  passwordHash: String,
  avatar: String (optional),
  preferences: {
    favoriteCategories: [String],
    notifications: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  category: String, // 'Silver', 'Diamond', 'Platinum', 'Gold'
  description: String,
  price: Number,
  images: [String], // Array of image URLs
  preorderAvailable: Boolean,
  inStock: Boolean,
  specifications: {
    material: String,
    weight: String,
    dimensions: String,
    gemstone: String
  },
  rating: Number,
  reviews: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    productName: String,
    productImage: String,
    quantity: Number,
    price: Number,
    isPreorder: Boolean
  }],
  totalAmount: Number,
  status: String, // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  paymentStatus: String, // 'pending', 'completed', 'failed', 'refunded'
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  estimatedDelivery: Date,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Payments Collection
```javascript
{
  _id: ObjectId,
  orderId: ObjectId,
  amount: Number,
  currency: String,
  method: String, // 'card', 'upi', 'netbanking', 'wallet'
  status: String, // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  transactionId: String,
  gatewayResponse: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### 5. UploadedImages Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  originalUrl: String,
  processedUrl: String,
  fileName: String,
  fileSize: Number,
  mimeType: String,
  metadata: {
    width: Number,
    height: Number,
    faceDetected: Boolean,
    neckPosition: {
      x: Number,
      y: Number,
      width: Number,
      height: Number
    }
  },
  uploadedAt: Date
}
```

### 6. TryOnResults Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  productId: ObjectId,
  userImageId: ObjectId,
  resultImageUrl: String,
  adjustments: {
    scale: Number,
    rotation: Number,
    position: {
      x: Number,
      y: Number
    }
  },
  shared: Boolean,
  shareUrl: String,
  createdAt: Date
}
```

### 7. ImportLogs Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  fileName: String,
  fileSize: Number,
  totalRows: Number,
  successfulImports: Number,
  failedImports: Number,
  errors: [String],
  status: String, // 'processing', 'completed', 'failed'
  importedAt: Date,
  processingTime: Number // in milliseconds
}
```

## API Endpoints

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
PUT /api/auth/profile
POST /api/auth/change-password
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh
```

### Product Endpoints
```
GET /api/products
GET /api/products/{id}
GET /api/products/category/{category}
GET /api/products/featured
GET /api/products/search?q={query}
GET /api/products/{id}/recommendations
POST /api/products/import
POST /api/products/validate-import
GET /api/products/import-history
```

### Order Endpoints
```
POST /api/orders
GET /api/orders
GET /api/orders/{id}
POST /api/orders/{id}/cancel
```

### Payment Endpoints
```
POST /api/payments/create-intent
POST /api/payments/confirm
GET /api/payments/methods
POST /api/payments/methods
DELETE /api/payments/methods/{id}
GET /api/payments/history
GET /api/payments/{id}
POST /api/payments/{id}/refund
```

### Image & Try-On Endpoints
```
POST /api/images/upload
GET /api/images/user
DELETE /api/images/{id}
POST /api/images/{id}/process
POST /api/try-on/create
GET /api/try-on/results
GET /api/try-on/results/{id}
PUT /api/try-on/results/{id}
DELETE /api/try-on/results/{id}
POST /api/try-on/results/{id}/save
POST /api/try-on/results/{id}/share
```

### Product Import Endpoints
```
POST /api/products/import
  - Accepts multipart/form-data with file upload
  - Supports CSV and XLSX files
  - Returns import status and results

POST /api/products/validate-import
  - Validates file format and required columns
  - Returns validation errors without importing

GET /api/products/import-history
  - Returns list of previous import attempts
  - Includes success/failure statistics
```

## Key Features to Implement

### 1. Authentication & Authorization
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### 2. Product Management
- CRUD operations for products
- Category filtering
- Search functionality
- Inventory management
- Featured products

### 3. Order Management
- Cart functionality
- Order creation and tracking
- Status updates
- Email notifications

### 4. Payment Integration
- Razorpay/Stripe integration
- Payment intent creation
- Payment confirmation
- Refund processing
- Payment method storage

### 5. Image Processing & Try-On
- Image upload and validation
- Face detection using OpenCV
- Neck area identification
- Jewelry overlay processing
- Image transformation (scale, rotate, position)
- Result image generation

### 6. File Storage
- Image upload to S3/local storage
- Image optimization and compression
- Multiple image sizes generation
- Secure file access

### 7. Bulk Product Import System
- CSV/Excel file upload and validation
- Batch processing of product data
- Error handling and reporting
- Import history and logging
- Data transformation and mapping
- Duplicate detection and handling

### 8. Security Features
- Input validation and sanitization
- Rate limiting
- CORS configuration
- File upload security
- SQL injection prevention

## Environment Variables
```
# Database
MONGODB_URL=mongodb://localhost:27017/jewelry_store

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=7

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
AWS_REGION=your-region

# Payment
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email
SMTP_PASSWORD=your-password

# App
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ORIGINS=http://localhost:5173
```

## Product Import File Format

### Required CSV/Excel Columns:
```
description (required) - Product name/description
price (required) - Price in ₹ format (e.g., "₹299999")
availability (required) - Stock status (e.g., "In Stock", "Out of Stock")
image (required) - Image URL
category (optional) - Product category (Silver, Diamond, Platinum, Gold)
specifications (optional) - Product specifications
```

### Example CSV Format:
```csv
description,price,availability,image,category,specifications
"Diamond Solitaire Ring 1.5ct","₹299999","In Stock","https://example.com/ring.jpg","Diamond","18k White Gold, 1.5ct Diamond"
"Gold Pearl Necklace","₹89999","Limited Stock","https://example.com/necklace.jpg","Gold","22k Gold, Freshwater Pearls"
```

## Dependencies (requirements.txt)
```
fastapi==0.104.1
uvicorn==0.24.0
motor==3.3.2
pymongo==4.6.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pillow==10.1.0
opencv-python==4.8.1.78
boto3==1.34.0
razorpay==1.4.1
python-dotenv==1.0.0
email-validator==2.1.0
aiofiles==23.2.1
pandas==2.1.3
openpyxl==3.1.2
xlrd==2.0.1
```

## FastAPI Implementation for Product Import

### 1. File Upload Endpoint
```python
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
import pandas as pd
import io
from typing import List, Dict, Any

@app.post("/api/products/import")
async def import_products(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    # Validate file type
    if not file.filename.endswith(('.csv', '.xlsx')):
        raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported")
    
    try:
        # Read file content
        content = await file.read()
        
        # Parse based on file type
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        # Validate required columns
        required_columns = ['description', 'price', 'availability', 'image']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required columns: {', '.join(missing_columns)}"
            )
        
        # Process and import products
        import_result = await process_product_import(df, current_user.id)
        
        # Log import attempt
        await log_import_attempt(
            user_id=current_user.id,
            filename=file.filename,
            file_size=len(content),
            result=import_result
        )
        
        return JSONResponse(content={
            "success": True,
            "data": import_result
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def process_product_import(df: pd.DataFrame, user_id: str) -> Dict[str, Any]:
    successful_imports = 0
    failed_imports = 0
    errors = []
    
    for index, row in df.iterrows():
        try:
            # Transform data
            product_data = {
                "name": row['description'],
                "description": row['description'],
                "price": parse_price(row['price']),
                "inStock": parse_availability(row['availability']),
                "images": [row['image']] if pd.notna(row['image']) else [],
                "category": row.get('category', 'Other'),
                "specifications": parse_specifications(row.get('specifications', '')),
                "preorderAvailable": False,
                "featured": False,
                "rating": 0,
                "reviews": 0,
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            
            # Insert into database
            result = await products_collection.insert_one(product_data)
            successful_imports += 1
            
        except Exception as e:
            failed_imports += 1
            errors.append(f"Row {index + 1}: {str(e)}")
    
    return {
        "imported": successful_imports,
        "failed": failed_imports,
        "errors": errors,
        "message": f"Successfully imported {successful_imports} products. {failed_imports} failed."
    }

def parse_price(price_str: str) -> float:
    """Parse price string and convert to float"""
    if pd.isna(price_str):
        raise ValueError("Price is required")
    
    # Remove currency symbols and convert to float
    price_clean = str(price_str).replace('₹', '').replace(',', '').strip()
    return float(price_clean)

def parse_availability(availability_str: str) -> bool:
    """Parse availability string and return boolean"""
    if pd.isna(availability_str):
        return False
    
    availability_lower = str(availability_str).lower()
    return 'in stock' in availability_lower or 'available' in availability_lower

def parse_specifications(spec_str: str) -> Dict[str, str]:
    """Parse specifications string into dictionary"""
    if pd.isna(spec_str) or not spec_str:
        return {}
    
    specs = {}
    # Simple parsing - can be enhanced based on format
    parts = str(spec_str).split(',')
    for part in parts:
        if ':' in part:
            key, value = part.split(':', 1)
            specs[key.strip()] = value.strip()
        else:
            specs['material'] = part.strip()
    
    return specs
```

### 2. File Validation Endpoint
```python
@app.post("/api/products/validate-import")
async def validate_import_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        content = await file.read()
        
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        errors = []
        
        # Check required columns
        required_columns = ['description', 'price', 'availability', 'image']
        missing_columns = [col for col in required_columns if col not in df.columns]
        
        if missing_columns:
            errors.append(f"Missing required columns: {', '.join(missing_columns)}")
        
        # Validate data types and formats
        for index, row in df.iterrows():
            if pd.isna(row.get('description')):
                errors.append(f"Row {index + 1}: Description is required")
            
            if pd.isna(row.get('price')):
                errors.append(f"Row {index + 1}: Price is required")
            else:
                try:
                    parse_price(row['price'])
                except ValueError as e:
                    errors.append(f"Row {index + 1}: Invalid price format")
        
        return JSONResponse(content={
            "success": True,
            "data": {
                "valid": len(errors) == 0,
                "errors": errors
            }
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### 3. Import History Endpoint
```python
@app.get("/api/products/import-history")
async def get_import_history(
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 20
):
    try:
        cursor = import_logs_collection.find(
            {"userId": ObjectId(current_user.id)}
        ).sort("importedAt", -1).skip(skip).limit(limit)
        
        import_logs = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string for JSON serialization
        for log in import_logs:
            log["_id"] = str(log["_id"])
            log["userId"] = str(log["userId"])
        
        return JSONResponse(content={
            "success": True,
            "data": import_logs
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def log_import_attempt(
    user_id: str,
    filename: str,
    file_size: int,
    result: Dict[str, Any]
):
    """Log import attempt to database"""
    log_data = {
        "userId": ObjectId(user_id),
        "fileName": filename,
        "fileSize": file_size,
        "totalRows": result.get("imported", 0) + result.get("failed", 0),
        "successfulImports": result.get("imported", 0),
        "failedImports": result.get("failed", 0),
        "errors": result.get("errors", []),
        "status": "completed" if result.get("failed", 0) == 0 else "partial",
        "importedAt": datetime.utcnow(),
        "processingTime": 0  # Can be calculated if needed
    }
    
    await import_logs_collection.insert_one(log_data)
```

## Deployment Considerations
- Use Docker for containerization
- Set up MongoDB Atlas for production
- Configure AWS S3 for file storage
- Set up Redis for caching
- Use Nginx as reverse proxy
- Implement logging and monitoring
- Set up CI/CD pipeline
- Configure SSL certificates
- Set up file upload limits and security
- Configure background job processing for large imports