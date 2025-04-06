# EPO Agent API Demo

A REST API server demonstrating the capabilities of the EPO Agent Toolkit. This server provides endpoints for patent analysis and information retrieval using the European Patent Office's Open Patent Services (OPS).

## Features

- 🔍 Patent analysis endpoint
- 🚀 Real-time processing
- 🔒 Rate limiting
- 🌐 CORS support
- 🏥 Health check endpoint
- 📝 Detailed error responses

## Prerequisites

- Node.js >= 18.0.0
- EPO OPS API credentials
- OpenAI API key

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdullahatrash/epo-agent-api-demo.git
   cd epo-agent-api-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your credentials:
   - EPO_CLIENT_ID
   - EPO_CLIENT_SECRET
   - OPENAI_API_KEY

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm run build
   npm start
   ```

## API Endpoints

### GET /health
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "ok"
}
```

### GET /api/analyze
Main endpoint for patent analysis.

**Parameters:**
- `query` (required): The analysis request or question
- `model` (optional): OpenAI model to use (default: 'gpt-4o')

**Example Request:**
```bash
curl "http://localhost:3000/api/analyze?query=Tell%20me%20about%20Tesla's%20battery%20patents"
```

**Example Response:**
```json
{
  "text": "Analysis result...",
  "steps": [
    {
      "toolCalls": [
        {
          "tool": "publishedDataSearch",
          "args": {
            "query": "..."
          }
        }
      ]
    }
  ]
}
```

## Deployment

### DigitalOcean App Platform

1. Fork this repository
2. Create a new app in DigitalOcean
3. Connect to your forked repository
4. Set environment variables:
   - EPO_CLIENT_ID
   - EPO_CLIENT_SECRET
   - OPENAI_API_KEY
5. Deploy!

### Railway

1. Create a new project
2. Connect to your GitHub repository
3. Add environment variables
4. Deploy automatically

### Local Docker Deployment

1. Build the image:
   ```bash
   docker build -t epo-agent-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env epo-agent-api
   ```

## PHP Integration Example

```php
<?php
$query = urlencode("Tell me about Tesla's battery patents");
$url = "https://your-api-url.com/api/analyze?query={$query}";

$response = file_get_contents($url);
$result = json_decode($response, true);

if ($result && isset($result['text'])) {
    echo $result['text'];
} else {
    echo "Error processing request";
}
```

## Error Handling

The API returns structured error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Common error codes:
- `MISSING_QUERY`: Query parameter is missing
- `PROCESSING_ERROR`: Error processing the request
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Rate Limiting

- 100 requests per IP address per 15 minutes
- Configurable via `RATE_LIMIT` environment variable

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT

## Support

For support, please open an issue in the GitHub repository.