import { describe, it, expect } from 'vitest';
import request from 'supertest'; // Import supertest
import app from './index.js'; // Import the Express app instance

// MSW will intercept the actual axios calls made by the app

describe('GET /rating', () => {
  it('should return 400 if title query parameter is missing', async () => {
    const response = await request(app).get('/rating'); // Use supertest
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Movie title is required' });
  });

  it('should return rating if found on 映画.com', async () => {
    const movieTitle = '存在する映画タイトル';
    const response = await request(app).get(
      // Use supertest
      `/rating?title=${encodeURIComponent(movieTitle)}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: movieTitle,
      rating: 4.5,
      source: '映画.com',
      searchUrl: `https://eiga.com/search/${encodeURIComponent(movieTitle)}`,
    });
  });

  it('should return 404 if rating is not found on 映画.com', async () => {
    const movieTitle = '評価のない映画タイトル';
    const response = await request(app).get(
      // Use supertest
      `/rating?title=${encodeURIComponent(movieTitle)}`
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Rating not found on 映画.com',
      searchUrl: `https://eiga.com/search/${encodeURIComponent(movieTitle)}`,
    });
  });

  it('should return 500 if fetching from 映画.com fails (network error)', async () => {
    const movieTitle = 'エラーが発生するタイトル';
    const response = await request(app).get(
      // Use supertest
      `/rating?title=${encodeURIComponent(movieTitle)}`
    );
    expect(response.status).toBe(500);
    expect(response.body.error).toContain(
      'Failed to fetch rating from 映画.com'
    );
  });

  it('should handle ratings with decimals correctly', async () => {
    const movieTitle = '小数評価の映画';
    const response = await request(app).get(
      // Use supertest
      `/rating?title=${encodeURIComponent(movieTitle)}`
    );
    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(3.8);
  });

  it('should handle ratings without decimals correctly', async () => {
    const movieTitle = '整数評価の映画';
    const response = await request(app).get(
      // Use supertest
      `/rating?title=${encodeURIComponent(movieTitle)}`
    );
    expect(response.status).toBe(200);
    expect(response.body.rating).toBe(4);
  });
});
