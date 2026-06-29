import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test("complete auth flow: register -> verify -> login -> setup profile", async ({
    page,
  }) => {
    const email = `test-${Date.now()}@example.com`;
    const password = "TestPass123";

    // Step 1: Navigate to register page
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);

    // Step 2: Fill registration form
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.fill('input[name="confirmPassword"]', password);

    // Step 3: Submit registration
    await page.click('button[type="submit"]');

    // Step 4: Verify redirect to verification page
    await expect(page).toHaveURL(/\/auth\/verify-email/, { timeout: 10000 });
    await expect(page.locator("text=Verifique seu email")).toBeVisible();

    // Step 5: Simulate email verification via token link
    const verifyUrl = `${APP_URL}/api/auth/verify-email?token=mock-verification-token`;
    await page.goto(verifyUrl);
    await expect(page.locator("text=Email verificado")).toBeVisible({ timeout: 10000 });

    // Step 6: Navigate to login
    await page.goto(`${APP_URL}/login`);
    await expect(page).toHaveURL(/\/login/);

    // Step 7: Fill login form
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    // Step 8: Submit login
    await page.click('button[type="submit"]');

    // Step 9: Verify redirect to dashboard/profile setup
    await expect(page).toHaveURL(/\/(dashboard|profile\/edit)/, { timeout: 10000 });

    // Step 10: Complete profile setup
    if (page.url().includes("/profile/edit") || page.url().includes("/dashboard")) {
      // Fill profile details
      const slugInput = page.locator('input[name="slug"]');
      if (await slugInput.isVisible()) {
        await slugInput.fill("test-user-profile");
        await page.fill('input[name="headline"]', "Software Engineer");
        await page.fill('textarea[name="bio"]', "Test bio for e2e testing");

        // Save profile
        await page.click('button[type="submit"]');

        // Verify profile saved
        await expect(page.locator("text=Perfil atualizado")).toBeVisible({
          timeout: 10000,
        });
      }
    }

    // Step 11: Verify user is logged in (check for user menu or avatar)
    await expect(page.locator('[data-testid="user-menu"], .user-avatar')).toBeVisible({
      timeout: 10000,
    });
  });

  test("shows validation errors on empty registration", async ({ page }) => {
    await page.click('a[href="/register"]');
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Nome deve ter no mínimo 2 caracteres")).toBeVisible();
    await expect(page.locator("text=Email é obrigatório")).toBeVisible();
    await expect(page.locator("text=Senha é obrigatória")).toBeVisible();
  });

  test("shows error on invalid login", async ({ page }) => {
    await page.goto(`${APP_URL}/login`);

    await page.fill('input[name="email"]', "wrong@example.com");
    await page.fill('input[name="password"]', "WrongPass123");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Credenciais inválidas")).toBeVisible({
      timeout: 10000,
    });
  });

  test("password reset flow", async ({ page }) => {
    // Go to login page
    await page.goto(`${APP_URL}/login`);

    // Click "Forgot password"
    await page.click('a[href="/auth/forgot-password"]');
    await expect(page).toHaveURL(/\/auth\/forgot-password/);

    // Submit email
    await page.fill('input[name="email"]', "test@example.com");
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(
      page.locator("text=Email de recuperação enviado")
    ).toBeVisible({ timeout: 10000 });
  });

  test("OAuth login buttons are present", async ({ page }) => {
    await page.goto(`${APP_URL}/login`);

    const googleBtn = page.locator('button:has-text("Google"), a:has-text("Google")');
    const githubBtn = page.locator('button:has-text("GitHub"), a:has-text("GitHub")');

    await expect(googleBtn).toBeVisible();
    await expect(githubBtn).toBeVisible();
  });
});
