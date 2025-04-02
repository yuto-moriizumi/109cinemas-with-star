import { http, HttpResponse, PathParams } from 'msw';

// 映画.comへのリクエストをモックするハンドラー
export const handlers = [
  http.get(
    'https://eiga.com/search/:title',
    ({ params }: { params: PathParams<'title'> }) => {
      // Add type annotation for params
      const title = params.title; // No need for 'as string' anymore
      // テストケースに応じて異なるHTMLを返す
      if (title === '存在する映画タイトル') {
        const mockHtml = `
          <html><body><span class="rating-star">4.5</span></body></html>
        `;
        return HttpResponse.html(mockHtml);
      }
      if (title === '小数評価の映画') {
        const mockHtml = `
          <html><body><span class="rating-star">3.8</span></body></html>
        `;
        return HttpResponse.html(mockHtml);
      }
      if (title === '整数評価の映画') {
        const mockHtml = `
          <html><body><span class="rating-star">4</span></body></html>
        `;
        return HttpResponse.html(mockHtml);
      }
      if (title === '評価のない映画タイトル') {
        const mockHtml = `
          <html><body><p>評価が見つかりません</p></body></html>
        `;
        return HttpResponse.html(mockHtml);
      }
      if (title === 'エラーが発生するタイトル') {
        // ネットワークエラーをシミュレート
        return HttpResponse.error();
      }

      // デフォルトのレスポンス (予期しないタイトル)
      return HttpResponse.html(
        '<html><body>Default Mock Response</body></html>',
        { status: 404 }
      );
    }
  ),
  // ルートへのアクセスをモック
  http.get('https://eiga.com/', () => {
    return HttpResponse.html('<html><body>Mock Root Response</body></html>');
  }),
];
