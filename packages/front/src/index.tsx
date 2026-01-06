import React from 'react';
import ReactDOM from 'react-dom/client';
import Rating from './Rating.js';

// 各 article 要素を取得
const articleElements = document.querySelectorAll('article');

articleElements.forEach((articleElement) => {
  // 映画IDを取得 (article要素内のaタグのhrefから取得)
  // 新しいHTML構造: div.main > a > header > h1
  const movieLink =
    articleElement.querySelector<HTMLAnchorElement>('div.main > a');
  // href="/movies/4479.html" or "/movies/4479.html?t=tomiya" のような形式を想定
  const href = movieLink?.getAttribute('href');
  const movieIdMatch = href?.match(/\/movies\/(\d+)\.html/);
  const movieId = movieIdMatch ? movieIdMatch[1] : null; // 例: "4479"
  // 映画タイトルを取得 (aタグ内のheader > h1)
  const titleElement = articleElement.querySelector('div.main > a header h1');
  const movieTitle = titleElement?.textContent?.trim() || null;

  if (movieId && movieTitle) {
    // レビュー表示用のコンテナ要素を作成
    const reviewContainer = document.createElement('div');
    reviewContainer.id = `movie-review-root-${movieId}`;

    // div.main に追加 (aタグの外側に配置)
    const mainElement = articleElement.querySelector('div.main');
    if (mainElement) {
      mainElement.appendChild(reviewContainer);

      // Reactコンポーネントをレンダリング
      ReactDOM.createRoot(reviewContainer).render(
        <React.StrictMode>
          {/* AppコンポーネントにmovieIdとmovieTitleを渡す */}
          <Rating movieTitle={movieTitle} />
        </React.StrictMode>
      );
    }
  } else {
    if (!movieId)
      console.warn('Movie ID not found in article element:', articleElement);
    if (!movieTitle)
      console.warn('Movie Title not found in article element:', articleElement);
  }
});
