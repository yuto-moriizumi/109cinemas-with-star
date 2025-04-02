import express, { Request, Response, RequestHandler } from "express"; // Use import syntax and add types, Add RequestHandler
import axios from "axios";
import * as cheerio from "cheerio"; // Change import syntax

const app = express();
const port: number = 3000; // Add type for port

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
    res.status(400).json({ error: "Movie title is required" }); // Remove return
    return; // Explicitly return void here
  }

  try {
    const searchUrl = `https://eiga.com/search/${encodeURIComponent(title)}`;
    const response = await axios.get<string>(searchUrl); // Specify response data type
    const html = response.data;
    const $ = cheerio.load(html);

    const ratingElement = $(".rating-star").first();
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
      res.json({
        title: title,
        rating: rating,
        source: "映画.com",
        searchUrl: searchUrl,
      });
    } else {
      res
        .status(404)
        .json({ error: "Rating not found on 映画.com", searchUrl: searchUrl });
    }
  } catch (error) {
    console.error("Error scraping 映画.com:", error);
    // Type guard for AxiosError
    if (axios.isAxiosError(error)) {
      res
        .status(500)
        .json({
          error: `Failed to fetch rating from 映画.com: ${error.message}`,
        });
    } else {
      res
        .status(500)
        .json({ error: "An unexpected error occurred while fetching rating." });
    }
  }
};

// Register the handler
app.get("/rating", ratingHandler);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
