import React from 'react';
import ReactDOM from 'react-dom/client';
import Rating from './Rating.js';

// 各 article 要素を取得
const articleElements = document.querySelectorAll('article');

articleElements.forEach((articleElement) => {
  // 映画IDを取得 (article要素内のaタグのhrefから取得)
  // Workaround for jsdom v27 querySelector regression: use getElementsByTagName instead
  const mainDiv = articleElement.getElementsByClassName('main')[0];
  const movieLink = mainDiv?.getElementsByTagName('a')[0] as
    | HTMLAnchorElement
    | undefined;
  // href="/movies/4479.html" or "/movies/4479.html?t=tomiya" のような形式を想定
  const href = movieLink?.getAttribute('href');
  const movieIdMatch = href?.match(/\/movies\/(\d+)\.html/);
  const movieId = movieIdMatch ? movieIdMatch[1] : null; // 例: "4479"
  // 映画タイトルを取得
  // Workaround for jsdom v27 querySelector regression: use getElementsByTagName instead
  const header = mainDiv?.getElementsByTagName('header')[0];
  const titleElement = header?.getElementsByTagName('h1')[0];
  const movieTitle = titleElement?.textContent?.trim() || null;

  if (movieId && movieTitle) {
    // レビュー表示用のコンテナ要素を作成
    const reviewContainer = document.createElement('div');
    reviewContainer.id = `movie-review-root-${movieId}`;
    // スタイルを削除

    // article要素内の div.main header に追加
    // Workaround for jsdom v27 querySelector regression: reuse header from above
    if (header) {
      header.appendChild(reviewContainer);

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
