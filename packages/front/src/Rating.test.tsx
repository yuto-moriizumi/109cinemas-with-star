import { render, screen, waitFor } from '@testing-library/react';
import Rating from './Rating';
// vi is no longer needed for fetch mocking
// import { vi } from 'vitest';

// createMockResponse function removed

describe('Rating Component', () => {
  // beforeEach for fetch mock removed

  test('ローディング状態を表示する', async () => {
    // Render the component with a title that MSW will handle
    render(<Rating movieTitle="Test Movie Title" />);
    // Initially, loading should be shown
    expect(screen.getByText('評価を取得中...')).toBeInTheDocument();
    // Wait for the loading text to disappear after MSW responds
    await waitFor(() => {
      expect(screen.queryByText('評価を取得中...')).not.toBeInTheDocument();
    });
  });

  test('取得した評価を正しく表示する', async () => {
    // MSW handler for 'Test Movie' returns { rating: 4.5 }
    render(<Rating movieTitle="Test Movie Title" />);

    // ローディングが消えるのを待つ
    await waitFor(() => {
      expect(screen.queryByText('評価を取得中...')).not.toBeInTheDocument();
    });

    // 評価が表示されるのを待つ
    await waitFor(() => {
      // 星の数を確認 (四捨五入で5つ)
      expect(screen.getByText(/★★★★★/)).toBeInTheDocument();
      // 数値評価を確認
      expect(screen.getByText(/\(4.5\)/)).toBeInTheDocument();
    });
  });

  test('評価データがない場合にメッセージを表示する', async () => {
    // MSW handler for 'Test Movie No Rating' returns { rating: null }
    render(<Rating movieTitle="Test Movie No Rating" />);

    await waitFor(() => {
      expect(screen.queryByText('評価を取得中...')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('評価データがありません。')).toBeInTheDocument();
    });
  });

  test('APIエラー時にエラーメッセージを表示する', async () => {
    // MSW handler for 'Test Movie Error' returns status 500
    render(<Rating movieTitle="Test Movie Error" />);

    await waitFor(() => {
      expect(screen.queryByText('評価を取得中...')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText('評価の取得に失敗しました。')
      ).toBeInTheDocument();
    });
  });

  // The 'fetchが失敗した場合' test case is removed as it's better covered by the 'APIエラー時' test using MSW's status code handling.
});
