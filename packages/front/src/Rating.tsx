import { useState, useEffect } from 'react';

interface AppProps {
  movieTitle: string; // movieTitle プロパティを追加
}

function Rating({ movieTitle }: AppProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiUrl = `https://6t1qt88xqk.execute-api.ap-northeast-1.amazonaws.com/dev/rating?title=${encodeURIComponent(
          movieTitle
        )}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // APIが { rating: number } のような形式で返すと仮定
        if (typeof data.rating === 'number') {
          setRating(data.rating);
        } else {
          // 数値でない場合や rating プロパティがない場合
          console.warn('Invalid rating data received:', data);
          setRating(null); // または適切なデフォルト値
          // setError('評価データの形式が無効です。'); // 必要に応じてエラー表示
        }
      } catch {
        setError('評価の取得に失敗しました。');
        setRating(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
    // movieTitle が変更された場合も再取得する (通常は movieId で十分かもしれないが、念のため)
  }, [movieTitle]);

  return (
    <div>
      {isLoading ? (
        <p>評価を取得中...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : rating !== null ? (
        // 取得した評価数値を表示 (例: 星で表示)
        <p>
          評価: {'★'.repeat(Math.round(rating))}
          {'☆'.repeat(5 - Math.round(rating))} ({rating.toFixed(1)})
        </p>
      ) : (
        <p>評価データがありません。</p>
      )}
    </div>
  );
}

export default Rating;
