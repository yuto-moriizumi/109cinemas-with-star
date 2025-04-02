import express, { RequestHandler } from 'express'; // Remove unused Request, Response
import axios from 'axios';
import * as cheerio from 'cheerio'; // Change import syntax
import cors from 'cors'; // corsミドルウェアをインポート

const app = express();

// CORSミドルウェアを設定
// フロントエンドのオリジンを許可
app.use(
  cors({
    origin: 'https://109cinemas.net',
  })
);
// const port: number = 3000; // Remove unused port variable

// Define an interface for the rating response
interface RatingResponse {
  title: string;
  rating: number;
  source: string;
  searchUrl: string;
}

// Define an interface for error responses
interface ErrorResponse {
  error: string;
  searchUrl?: string; // Optional searchUrl for debugging
}

// Define the handler function separately with explicit RequestHandler type
const ratingHandler: RequestHandler = async (req, res) => {
  const title = req.query.title as string | undefined; // Type assertion for title

  if (!title) {
    // Add ErrorResponse type annotation
    res.status(400).json({ error: 'Movie title is required' } as ErrorResponse);
    return; // Explicitly return void here
  }

  try {
    const searchUrl = `https://eiga.com/search/${encodeURIComponent(title)}`;
    const response = await axios.get<string>(searchUrl); // Specify response data type
    const html = response.data;
    const $ = cheerio.load(html);

    const ratingElement = $('.rating-star').first();
    let rating: number | null = null; // Add type for rating

    if (ratingElement.length > 0) {
      const ratingText = ratingElement.text().trim();
      const ratingMatch = ratingText.match(/(\d+(\.\d+)?)/);
      if (ratingMatch && ratingMatch[1]) {
        // Check if ratingMatch and group 1 exist
        rating = parseFloat(ratingMatch[1]);
      }
    }

    if (rating !== null) {
      // Add RatingResponse type annotation
      res.json({
        title: title,
        rating: rating,
        source: '映画.com',
        searchUrl: searchUrl,
      } as RatingResponse);
    } else {
      // Add ErrorResponse type annotation
      res.status(404).json({
        error: 'Rating not found on 映画.com',
        searchUrl: searchUrl,
      } as ErrorResponse);
    }
  } catch (error) {
    // Type guard for AxiosError
    if (axios.isAxiosError(error)) {
      // Add ErrorResponse type annotation
      res.status(500).json({
        error: `Failed to fetch rating from 映画.com: ${error.message}`,
      } as ErrorResponse);
    } else {
      // Add ErrorResponse type annotation
      res.status(500).json({
        error: 'An unexpected error occurred while fetching rating.',
      } as ErrorResponse);
    }
  }
};

// Register the handler
app.get('/rating', ratingHandler);

export default app; // Export the app instance
