import { http, HttpResponse } from 'msw';

// APIのエンドポイントのベースURL (テスト対象のコンポーネントが使用するものに合わせる)
// Rating.tsx では絶対URLを使用しているため、完全なURLでマッチさせる
const API_BASE_URL =
  'https://6t1qt88xqk.execute-api.ap-northeast-1.amazonaws.com/dev';

export const handlers = [
  // /rating エンドポイントへの GET リクエストをハンドル
  http.get(`${API_BASE_URL}/rating`, ({ request }) => {
    const url = new URL(request.url);
    const title = url.searchParams.get('title');

    // テストケースに応じてレスポンスを分岐
    if (title === 'Test Movie Title') {
      // Test uses "Test Movie Title"
      return HttpResponse.json({ rating: 4.5 });
    }
    if (title === 'Another Movie') {
      // Test uses "Another Movie"
      // Return default 3.0 as per test expectation
      return HttpResponse.json({ rating: 3.0 });
    }
    if (title === 'Movie Without Header') {
      // Title from the fallback test
      // Return default 3.0 as per test expectation
      return HttpResponse.json({ rating: 3.0 });
    }
    if (title === 'Test Movie No Rating') {
      // Keep this case from Rating.test.tsx
      return HttpResponse.json({ rating: null });
    }
    if (title === 'Test Movie Error') {
      // Keep this case from Rating.test.tsx
      // APIエラーをシミュレート (ステータスコード 500)
      return new HttpResponse(null, { status: 500 });
    }
    // Removed 'Test Movie Network Error' specific handling as it wasn't used effectively

    // デフォルトの成功レスポンス (上記以外の場合)
    console.warn(
      `[MSW] Unhandled title: "${title}", returning default rating 3.0`
    );
    return HttpResponse.json({ rating: 3.0 });
  }),

  // 他のエンドポイントのハンドラも必要に応じて追加
];
