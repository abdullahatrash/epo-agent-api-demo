import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { EPOAgentToolkit } from 'epo-ops-agent-toolkit';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize EPO Toolkit
const epoToolkit = new EPOAgentToolkit({
  key: process.env.EPO_CLIENT_ID!,
  secret: process.env.EPO_CLIENT_SECRET!,
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Main API endpoint for patent analysis
app.get('/api/analyze', async (req, res) => {
  try {
    const { query, model = 'gpt-4o' } = req.query;

    if (!query) {
      return res.status(400).json({
        error: {
          code: 'MISSING_QUERY',
          message: 'Query parameter is required'
        }
      });
    }

    const tools = epoToolkit.getTools();
    
    const result = await generateText({
      model: openai(model as string),
      messages: [
        {
          role: 'system',
          content: 'You are PatentGPT, a patent intelligence assistant. Analyze patents and provide insights about technologies.'
        },
        {
          role: 'user',
          content: query as string
        }
      ],
      tools,
      maxSteps: 5
    });

    res.json({
      text: result.text,
      steps: result.steps.map(step => ({
        toolCalls: step.toolCalls.map(call => ({
          tool: call.toolName,
          args: call.args
        }))
      }))
    });

  } catch (error: any) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: {
        code: 'PROCESSING_ERROR',
        message: error.message || 'An error occurred while processing your request'
      }
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- GET /api/analyze?query=your_query_here');
});