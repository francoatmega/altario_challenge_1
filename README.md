# Altario - File Upload Service

A robust NestJS service for handling CSV file uploads with rate limiting, concurrent processing limits, and comprehensive validation. Built with scalability and reliability in mind.

## Features

- 📁 CSV file upload with size and type validation
- ⚡ Rate limiting (1 request per 10 seconds per client)
- 🔄 Concurrent processing limits (max 5 concurrent requests)
- 🔒 Basic authentication
- 🏥 Health check endpoint with system metrics
- 🔍 Request correlation IDs for request tracking
- 🌐 Proxy-aware IP detection
- 📊 Detailed memory usage monitoring

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Basic understanding of REST APIs and file uploads

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd altario

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start in development mode
npm run start:dev
```

## Configuration

Create a `.env` file with the following variables:

```env
PORT=3001
BASIC_AUTH=user:pass
MAX_FILE_SIZE=250000000  # 250MB in bytes
UPLOAD_DIR=upload
```

## API Documentation

### File Upload

Upload a CSV file with optional description.

```bash
curl --location 'http://localhost:3000/upload/csv' \
--header 'Authorization: Basic YWRtaW46YWRtaW4xMjM=' \
--form 'file=@"/path/to/your/file.csv"'
```

#### Request Headers
- `Authorization`: Basic auth credentials
- `Content-Type`: multipart/form-data

#### Request Body
- `file`: CSV file to upload
- `description`: (Optional) File description

#### Success Response
```json
{
  "message": "File uploaded and processed successfully"
}
```

### Health Check

Monitor system health and resource usage.

```bash
curl --location 'http://localhost:3000/health'
```

#### Response
```json
{
  "status": "ok",
  "timestamp": "2024-03-14T12:00:00.000Z",
  "memory": {
    "system": {
      "totalMemory": 8589934592,
      "freeMemory": 4294967296,
      "usedMemory": 4294967296,
      "systemMemoryUsagePercent": 50
    },
    "process": {
      "heapUsed": 52428800,
      "heapTotal": 104857600,
      "rss": 26214400,
      "external": 1048576,
      "processMemoryUsagePercent": 50
    }
  }
}
```

## Rate Limiting

The service implements strict rate limiting to prevent abuse:

- 1 request per 10 seconds per client
- IP detection works through proxies (X-Forwarded-For header)
- Rate limits are enforced per client IP

### Rate Limit Response
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests"
}
```

## Concurrent Processing

To prevent system overload, the service limits concurrent file processing:

- Maximum 5 concurrent file processing operations
- Additional requests are rejected with a clear error message

### Concurrent Processing Limit Response
```json
{
  "statusCode": 400,
  "message": "Maximum concurrent processing limit reached. Please try again later."
}
```

## File Validation

### Size Limits
- Maximum file size: 250MB
- Response for oversized files:
```json
{
  "statusCode": 400,
  "message": "File size exceeds maximum limit of 250MB"
}
```

### File Type Validation
- Only CSV files are accepted
- Response for invalid file types:
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only CSV files are allowed"
}
```

## Error Handling

### Authentication Error
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Missing File
```json
{
  "statusCode": 400,
  "message": "No file provided"
}
```

## Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:e2e

# Run all tests with coverage
npm run test:all:cov
```

## Development

### Project Structure
```
src/
├── file-upload/       # File upload module
├── health/            # Health check module
├── auth/              # Authentication module
├── logging/           # Logging module
└── middleware/        # Global middleware
```

### Roadmap

#### Resiliency and Fault Tolerance
Consider implementing exponential backoff – discussion needed on whether it should be in the caller or callee service.

#### Dynamic Throttling
Run tests to define accurate metrics and create a fair throttling mechanism.

### Adding New Features
1. Create a new module in the appropriate directory
2. Add the module to `app.module.ts`
3. Write unit tests in `test/unit/`
4. Write integration tests in `test/integration/`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
