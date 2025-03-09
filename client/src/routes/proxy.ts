// server/src/routes/proxy.ts
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/stream/*', async (req, res) => {
  try {
    const url = req.params[0];
    if (!url) {
      return res.status(400).send('No URL provided');
    }

    // Add required headers for the IPTV provider
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Origin': 'http://localhost:3000',
      'Referer': 'http://localhost:3000'
    };

    // Forward the request to the actual stream
    const response = await axios({
      method: 'get',
      url: decodeURIComponent(url),
      headers,
      responseType: 'stream',
      timeout: 30000 // 30 second timeout
    });

    // Forward the response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Pipe the stream response
    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).send('Proxy error');
  }
});

export default router;
