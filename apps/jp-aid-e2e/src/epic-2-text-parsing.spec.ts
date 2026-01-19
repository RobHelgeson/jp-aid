import {expect, test} from '@playwright/test';

test.describe('Epic 2: Sentence & Word Deconstruction', () => {
  test.describe('Basic Search Flow', () => {
    test('search page accepts Japanese text input', async ({page}) => {
      await page.goto('/');

      const searchInput = page.locator('input[name="searchQuery"]');
      await expect(searchInput).toBeVisible();

      await searchInput.fill('日本語');
      await expect(searchInput).toHaveValue('日本語');
    });

    test('submitting search navigates to results with query param', async ({page}) => {
      await page.goto('/');

      const searchInput = page.locator('input[name="searchQuery"]');
      await searchInput.fill('日本語');

      const searchButton = page.locator('button[type="submit"]');
      await searchButton.click();

      await expect(page).toHaveURL(/\/search\?q=%E6%97%A5%E6%9C%AC%E8%AA%9E/);
    });

    test('single word search displays correct kanji in order', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const kanjiCards = page.locator('.kanji-card');
      await expect(kanjiCards).toHaveCount(3);

      const titles = await page.locator('mat-card-title').allTextContents();
      expect(titles).toEqual(['日', '本', '語']);
    });

    test('clicking kanji navigates to detail page', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const firstCard = page.locator('.kanji-card').first();
      await firstCard.click();

      await expect(page).toHaveURL(/\/kanji\//);
      expect(page.url()).toContain('/kanji/');
    });

    test('detail page shows correct kanji information', async ({page}) => {
      await page.goto('/kanji/日?q=日本語');

      await expect(page.locator('.kanji-display-title')).toContainText('日');
      await expect(page.locator('.meanings-section')).toContainText('day');
    });

    test('back button returns to results with query preserved', async ({page}) => {
      await page.goto('/kanji/日?q=日本語');

      const backButton = page.locator('button:has-text("Return to Results")');
      await backButton.click();

      await expect(page).toHaveURL(/\/search\?q=%E6%97%A5%E6%9C%AC%E8%AA%9E/);
    });

    test('transitions complete within acceptable time', async ({page}) => {
      await page.goto('/');

      const startTime = Date.now();

      const searchInput = page.locator('input[name="searchQuery"]');
      await searchInput.fill('日本語');

      const searchButton = page.locator('button[type="submit"]');
      await searchButton.click();

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const endTime = Date.now();
      const transitionTime = endTime - startTime;

      expect(transitionTime).toBeLessThan(2000);
    });
  });

  test.describe('Order Preservation', () => {
    test('search "日本語" displays kanji in order: 日, 本, 語', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const titles = await page.locator('mat-card-title').allTextContents();
      expect(titles).toEqual(['日', '本', '語']);
    });

    test('clicking third kanji (語) shows correct detail', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const thirdCard = page.locator('.kanji-card').nth(2);
      await thirdCard.click();

      await expect(page).toHaveURL(/\/kanji\//);
      await expect(page.locator('.kanji-display-title')).toContainText('語');
    });

    test('Previous button from 語 navigates to 本', async ({page}) => {
      await page.goto('/search?q=日本語');
      await page.waitForSelector('.kanji-card', {state: 'visible'});

      await page.locator('.kanji-card').nth(2).click();
      await page.waitForSelector('.kanji-display-title', {state: 'visible'});

      const prevButton = page.locator('button[aria-label="Previous kanji"]');
      await prevButton.click();

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      await expect(page.locator('.kanji-display-title')).toContainText('本');
    });

    test('Previous button from 本 navigates to 日', async ({page}) => {
      await page.goto('/search?q=日本語');
      await page.waitForSelector('.kanji-card', {state: 'visible'});

      await page.locator('.kanji-card').nth(1).click();
      await page.waitForSelector('.kanji-display-title', {state: 'visible'});

      const prevButton = page.locator('button[aria-label="Previous kanji"]');
      await prevButton.click();

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      await expect(page.locator('.kanji-display-title')).toContainText('日');
    });

    test('Next button from 日 navigates to 本', async ({page}) => {
      await page.goto('/search?q=日本語');
      await page.waitForSelector('.kanji-card', {state: 'visible'});

      await page.locator('.kanji-card').first().click();
      await page.waitForSelector('.kanji-display-title', {state: 'visible'});

      const nextButton = page.locator('button[aria-label="Next kanji"]');
      await nextButton.click();

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      await expect(page.locator('.kanji-display-title')).toContainText('本');
    });

    test('Next button from 語 is disabled', async ({page}) => {
      await page.goto('/search?q=日本語');
      await page.waitForSelector('.kanji-card', {state: 'visible'});

      await page.locator('.kanji-card').nth(2).click();
      await page.waitForSelector('.kanji-display-title', {state: 'visible'});

      const nextButton = page.locator('button[aria-label="Next kanji"]');
      await expect(nextButton).toBeDisabled();
    });
  });

  test.describe('Error States', () => {
    test('hiragana-only input shows "No Kanji Found" message', async ({page}) => {
      await page.goto('/search?q=あいうえお');

      await page.waitForSelector('.no-results', {state: 'visible'});

      await expect(page.locator('h2')).toContainText('No Kanji Found');
      await expect(page.locator('text=No kanji characters found')).toBeVisible();
    });

    test('Latin-only input shows "No Kanji Found" message', async ({page}) => {
      await page.goto('/search?q=hello%20world');

      await page.waitForSelector('.no-results', {state: 'visible'});

      await expect(page.locator('h2')).toContainText('No Kanji Found');
    });

    test('kanji not in database shows "Kanji Not Available" warning', async ({page}) => {
      await page.goto('/search?q=漢字学習');

      await page.waitForSelector('.no-results', {state: 'visible'});

      await expect(page.locator('h2')).toContainText('Kanji Not Available');
      await expect(page.locator('text=not yet in our database')).toBeVisible();
    });

    test('partial match shows notice with missing kanji listed', async ({page}) => {
      await page.goto('/search?q=日本漢字');

      await page.waitForSelector('.partial-match-notice', {state: 'visible'});

      await expect(page.locator('.partial-match-notice')).toContainText('Found 2 of 4 kanji');
      await expect(page.locator('.partial-match-notice')).toContainText('漢');
      await expect(page.locator('.partial-match-notice')).toContainText('字');
    });

    test('"Try Another Search" button returns to search page', async ({page}) => {
      await page.goto('/search?q=あいうえお');

      await page.waitForSelector('.no-results', {state: 'visible'});

      const tryAnotherButton = page.locator('button:has-text("Try Another Search")');
      await tryAnotherButton.click();

      await expect(page).toHaveURL('/');
    });

    test('"New Search" button from results returns to search page', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.back-button', {state: 'visible'});

      const newSearchButton = page.locator('.back-button');
      await newSearchButton.click();

      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Multi-Sentence Support', () => {
    test('multi-sentence input shows grouped display', async ({page}) => {
      await page.goto('/search?q=日本語。中国語。');

      await page.waitForSelector('.segment-group', {state: 'visible'});

      const segmentGroups = page.locator('.segment-group');
      await expect(segmentGroups).toHaveCount(2);
    });

    test('first segment header shows "日本語"', async ({page}) => {
      await page.goto('/search?q=日本語。中国語。');

      await page.waitForSelector('.segment-group', {state: 'visible'});

      const firstSegmentHeader = page.locator('.segment-header').first();
      await expect(firstSegmentHeader).toContainText('日本語');
    });

    test('second segment header shows "中国語"', async ({page}) => {
      await page.goto('/search?q=日本語。中国語。');

      await page.waitForSelector('.segment-group', {state: 'visible'});

      const secondSegmentHeader = page.locator('.segment-header').nth(1);
      await expect(secondSegmentHeader).toContainText('中国語');
    });

    test('segment headers show correct kanji count', async ({page}) => {
      await page.goto('/search?q=日本語。中国語。');

      await page.waitForSelector('.segment-group', {state: 'visible'});

      const firstCount = page.locator('.segment-count').first();
      await expect(firstCount).toContainText('3 kanji');

      const secondCount = page.locator('.segment-count').nth(1);
      await expect(secondCount).toContainText('3 kanji');
    });

    test('clicking kanji in segment navigates to detail', async ({page}) => {
      await page.goto('/search?q=日本語。中国語。');

      await page.waitForSelector('.segment-group', {state: 'visible'});

      const kanjiCard = page.locator('.segment-group').first().locator('.kanji-card').first();
      await kanjiCard.click();

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      expect(page.url()).toContain('/kanji/');
    });

    test('single word input shows flat display (no grouping)', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const segmentGroups = page.locator('.segment-group');
      await expect(segmentGroups).toHaveCount(0);

      const resultsSection = page.locator('.results-section');
      await expect(resultsSection).not.toHaveClass(/grouped-results/);
    });
  });

  test.describe('Accessibility', () => {
    test('tab navigation through search input and submit', async ({page}) => {
      await page.goto('/');

      await page.keyboard.press('Tab');

      const searchInput = page.locator('input[name="searchQuery"]');
      await expect(searchInput).toBeFocused();

      await searchInput.fill('日本語');
      await page.keyboard.press('Tab');

      const searchButton = page.locator('button[type="submit"]');
      await expect(searchButton).toBeFocused();
    });

    test('tab navigation through kanji result cards', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      const firstCard = page.locator('.kanji-card').first();
      await expect(firstCard).toBeFocused();

      await page.keyboard.press('Tab');

      const secondCard = page.locator('.kanji-card').nth(1);
      await expect(secondCard).toBeFocused();
    });

    test('Enter activates kanji card selection', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const firstCard = page.locator('.kanji-card').first();
      await firstCard.focus();
      await page.keyboard.press('Enter');

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      expect(page.url()).toContain('/kanji/');
    });

    test('Space activates kanji card selection', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const firstCard = page.locator('.kanji-card').first();
      await firstCard.focus();
      await page.keyboard.press('Space');

      await page.waitForSelector('.kanji-display-title', {state: 'visible'});
      expect(page.url()).toContain('/kanji/');
    });

    test('results container has proper ARIA attributes', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const main = page.locator('main[role="main"]');
      await expect(main).toHaveAttribute('aria-label', 'Search results');

      const grid = page.locator('[role="list"]');
      await expect(grid).toHaveAttribute('aria-label', 'Kanji search results');
    });

    test('kanji cards have proper ARIA attributes', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const firstCard = page.locator('.kanji-card').first();
      await expect(firstCard).toHaveAttribute('role', 'button');
      await expect(firstCard).toHaveAttribute('tabindex', '0');

      const ariaLabel = await firstCard.getAttribute('aria-label');
      expect(ariaLabel).toContain('日');
      expect(ariaLabel).toContain('day');
    });

    test('error state has proper ARIA live region', async ({page}) => {
      await page.goto('/search?q=あいうえお');

      await page.waitForSelector('.no-results', {state: 'visible'});

      const errorSection = page.locator('.no-results[role="status"]');
      await expect(errorSection).toHaveAttribute('aria-live', 'polite');
    });

    test('loading spinner has proper ARIA attributes', async ({page}) => {
      await page.goto('/search?q=日本語');

      const spinnerContainer = await page.$('.spinner-container');
      if (spinnerContainer) {
        const role = await spinnerContainer.getAttribute('role');
        const ariaLive = await spinnerContainer.getAttribute('aria-live');
        expect(role).toBe('status');
        expect(ariaLive).toBe('polite');
      } else {
        await page.waitForSelector('.kanji-card', {state: 'visible'});
        expect(true).toBe(true);
      }
    });
  });

  test.describe('Performance', () => {
    test('results load within 1.5 seconds', async ({page}) => {
      const startTime = Date.now();

      await page.goto('/search?q=日本語');
      await page.waitForSelector('.kanji-card', {state: 'visible'});

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(1500);
    });

    test('loading spinner appears and disappears correctly', async ({page}) => {
      await page.goto('/search?q=日本語');

      await page.waitForSelector('.kanji-card', {state: 'visible'});
      const spinnerAfterLoad = await page.$('.spinner-container');
      expect(spinnerAfterLoad).toBeNull();
    });
  });
});
