import { screen, waitFor, act } from '@testing-library/react'; // Import act
import { server } from './mocks/server'; // MSW server for Rating component

// Helper function to set up the DOM for tests
const setupDOM = (html: string) => {
  document.body.innerHTML = html;
};

describe('index.tsx script', () => {
  beforeAll(() => server.listen()); // Start MSW server before all tests
  afterEach(() => {
    // Clean up DOM and reset MSW handlers after each test
    document.body.innerHTML = '';
    server.resetHandlers();
    // Reset modules to allow re-importing index.tsx in each test
    vi.resetModules();
  });
  afterAll(() => server.close()); // Close MSW server after all tests

  test('記事要素にRatingコンポーネントを正しく挿入し、評価を表示する', async () => {
    // Removed .only
    // Arrange: Set up mock DOM structure (new 109cinemas.net structure)
    // New structure: div.main > a > header > h1
    setupDOM(`
      <article>
        <div class="main">
          <a href="/movies/12345.html">
            <header>
              <h1>Test Movie Title</h1>
            </header>
          </a>
          <!-- Rating component will be inserted here as a sibling of <a> -->
        </div>
      </article>
      <article>
        <div class="main">
          <a href="/movies/67890.html?t=other">
            <header>
              <h1>Another Movie</h1>
            </header>
          </a>
          <!-- Rating component will be inserted here as a sibling of <a> -->
        </div>
      </article>
    `);

    // Act: Dynamically import and execute the script within act
    await act(async () => {
      await import('./index'); // Remove .tsx extension
    });

    // Assert: Check if Rating components were rendered
    // We expect two Rating components to be rendered initially showing loading state
    // MSW handler for "Test Movie Title" should return 4.5 (★★★★★)
    // MSW handler for "Another Movie" should return default 3.0 (★★★☆☆)

    // Wait for both ratings to appear and assert within a single waitFor
    await waitFor(() => {
      // Check first rating
      const ratingContainer1 = document.getElementById(
        'movie-review-root-12345'
      );
      expect(ratingContainer1).toBeInTheDocument();
      expect(
        screen.getByText(/★★★★★/, { selector: '#movie-review-root-12345 *' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/\(4.5\)/, { selector: '#movie-review-root-12345 *' })
      ).toBeInTheDocument();

      // Check second rating
      const ratingContainer2 = document.getElementById(
        'movie-review-root-67890'
      );
      expect(ratingContainer2).toBeInTheDocument();
      expect(
        screen.getByText(/★★★☆☆/, { selector: '#movie-review-root-67890 *' })
      ).toBeInTheDocument();
      expect(
        screen.getByText(/\(3.0\)/, { selector: '#movie-review-root-67890 *' })
      ).toBeInTheDocument();
    });
  });

  test('映画IDが見つからない場合、Ratingコンポーネントを挿入しない', async () => {
    // Arrange: Set up DOM without a valid movie link href (new structure)
    setupDOM(`
      <article>
        <div class="main">
          <a>
            <header>
              <h1>Movie Without ID</h1>
            </header>
          </a>
        </div>
      </article>
    `);

    // Act
    await act(async () => {
      await import('./index'); // Remove .tsx extension
    });

    // Assert
    // Check that no container div was created
    expect(document.querySelector('div[id^="movie-review-root-"]')).toBeNull();
    // Check that Rating component related text is not present
    expect(screen.queryByText('評価を取得中...')).toBeNull();
  });

  test('映画タイトルが見つからない場合、Ratingコンポーネントを挿入しない', async () => {
    // Arrange: Set up DOM without an h1 title (new structure)
    setupDOM(`
      <article>
        <div class="main">
          <a href="/movies/11111.html">
            <header>
              <!-- No h1 title -->
            </header>
          </a>
        </div>
      </article>
    `);

    // Act
    await act(async () => {
      await import('./index'); // Remove .tsx extension
    });

    // Assert
    expect(document.querySelector('div[id^="movie-review-root-"]')).toBeNull();
    expect(screen.queryByText('評価を取得中...')).toBeNull();
  });

  test('article要素がない場合、何も挿入しない', async () => {
    // Arrange: Set up empty DOM
    setupDOM('');

    // Act
    await act(async () => {
      await import('./index'); // Remove .tsx extension
    });

    // Assert
    expect(document.querySelector('div[id^="movie-review-root-"]')).toBeNull();
    expect(screen.queryByText('評価を取得中...')).toBeNull();
  });
});
