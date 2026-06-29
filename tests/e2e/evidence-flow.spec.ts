import { test, expect } from "@playwright/test";

const APP_URL = process.env.APP_URL || "http://localhost:3000";

test.describe("Evidence Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${APP_URL}/login`);
    await page.fill('input[name="email"]', "e2e-test@example.com");
    await page.fill('input[name="password"]', "E2eTestPass123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(dashboard|evidence)/, { timeout: 10000 });
  });

  test("complete evidence flow: upload -> request verification -> approved", async ({
    page,
  }) => {
    // Step 1: Navigate to evidence page
    await page.click('a[href="/evidence"], button:has-text("Evidências")');
    await expect(page).toHaveURL(/\/evidence/);

    // Step 2: Add new evidence
    await page.click('a[href="/evidence/new"], button:has-text("Nova Evidência")');
    await expect(page).toHaveURL(/\/evidence\/(new|create)/);

    // Step 3: Fill evidence form
    await page.fill('input[name="title"]', "Certificado E2E Test");
    await page.fill('textarea[name="description"]', "Certificado gerado durante teste automatizado");
    await page.selectOption('select[name="type"]', "CERTIFICATE");
    await page.fill('input[name="source"]', "Playwright E2E");

    // Optional: upload file
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await fileInput.setInputFiles({
        name: "test-cert.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("fake pdf content"),
      });
    }

    // Step 4: Submit evidence
    await page.click('button[type="submit"]');

    // Step 5: Verify evidence created
    await expect(page.locator("text=Evidência criada com sucesso")).toBeVisible({
      timeout: 10000,
    });
    await expect(page).toHaveURL(/\/evidence\/(?!new|create)/);

    // Step 6: Request verification
    const verifyBtn = page.locator('button:has-text("Solicitar Verificação"), a:has-text("Verificar")');
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click();
      await expect(page.locator("text=Solicitação enviada")).toBeVisible({
        timeout: 10000,
      });
    }

    // Step 7: Simulate admin approval (navigate to admin verification page)
    await page.goto(`${APP_URL}/admin/verifications`);
    await expect(page).toHaveURL(/\/admin\/verifications/);

    // Step 8: Find the pending request and approve
    const pendingItem = page.locator('text=Certificado E2E Test').first();
    if (await pendingItem.isVisible()) {
      await pendingItem.click();
      const approveBtn = page.locator('button:has-text("Aprovar"), button:has-text("APPROVED")');
      if (await approveBtn.isVisible()) {
        await approveBtn.click();
        await expect(page.locator("text=Verificação aprovada")).toBeVisible({
          timeout: 10000,
        });
      }
    }

    // Step 9: Verify evidence shows as verified on user profile
    await page.goto(`${APP_URL}/evidence`);
    await expect(page.locator("text=Verificado").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("rejects evidence with invalid data", async ({ page }) => {
    await page.click('a[href="/evidence/new"], button:has-text("Nova Evidência")');

    // Submit empty form
    await page.click('button[type="submit"]');

    // Check validation errors
    await expect(page.locator("text=Título deve ter no mínimo 3 caracteres")).toBeVisible();
  });

  test("lists user evidences", async ({ page }) => {
    await page.goto(`${APP_URL}/evidence`);

    await expect(
      page.locator('[data-testid="evidence-list"], .evidence-grid')
    ).toBeVisible({ timeout: 10000 });
  });

  test("deletes evidence", async ({ page }) => {
    await page.goto(`${APP_URL}/evidence`);

    const deleteBtn = page.locator('button[aria-label="Deletar"], button:has-text("Excluir")').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();

      // Confirm deletion
      const confirmBtn = page.locator(
        'button:has-text("Confirmar"), button:has-text("Sim"), button:has-text("Deletar")'
      );
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
        await expect(page.locator("text=Evidência removida")).toBeVisible({
          timeout: 10000,
        });
      }
    }
  });

  test("evidence verification request appears for admins", async ({ page }) => {
    // Submit evidence as user first
    await page.goto(`${APP_URL}/evidence/new`);
    await page.fill('input[name="title"]', "Evidence for Review");
    await page.selectOption('select[name="type"]', "DOCUMENT");
    await page.click('button[type="submit"]');

    // Request verification
    const requestBtn = page.locator('button:has-text("Solicitar Verificação")');
    if (await requestBtn.isVisible()) {
      await requestBtn.click();
    }

    // Verify request was sent
    await expect(page.locator("text=Solicitação enviada")).toBeVisible({
      timeout: 10000,
    });
  });
});
