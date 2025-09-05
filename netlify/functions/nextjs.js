// Netlify function handler for Next.js
const { NextRequest } = require('next/server');

// This function will be called by Netlify for all routes
exports.handler = async (event, context) => {
  try {
    // Import Next.js server
    const { default: nextHandler } = await import('next/dist/server/next-server.js');
    
    // Create NextRequest from Netlify event
    const request = new NextRequest(event.rawUrl, {
      method: event.httpMethod,
      headers: new Headers(event.headers),
      body: event.body ? JSON.stringify(event.body) : undefined,
    });

    // Handle the request with Next.js
    const response = await nextHandler(request);
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
