import { expect, test } from "@playwright/test";

test("operador consulta a localização de um SKU", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Bom dia, Rafael." })).toBeVisible();

  await page.getByRole("button", { name: "Estoque" }).first().click();
  await expect(page.getByRole("heading", { name: "Localização de estoque" })).toBeVisible();

  const search = page.getByLabel("Produto");
  await search.fill("CAM-PT-M");
  await expect(page.getByText("Estante A · Prateleira 03 · Caixa 07 · Posição 02")).toBeVisible();
  await expect(page.getByText("A-03-07-02")).toBeVisible();
});

test("operador confirma um SKU da separação", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Separação" }).first().click();
  await expect(page.getByRole("heading", { name: "Separação do dia" })).toBeVisible();

  const item = page
    .getByText("GAR-INOX-750")
    .locator("xpath=ancestor::div[contains(@class, 'surface-card')]");
  await item.getByRole("button", { name: "Confirmar" }).click();
  await expect(item.getByText("Confirmado", { exact: true })).toBeVisible();
  await expect(page.getByText("GAR-INOX-750 separado com sucesso.")).toBeVisible();
});

test("protótipo comunica carregamento, vazio e erro", async ({ page }) => {
  await page.goto("/");
  const scenario = page.getByLabel("Estado dos dados no protótipo");

  await scenario.selectOption("loading");
  await expect(page.getByLabel("Carregando conteúdo")).toBeVisible();

  await scenario.selectOption("empty");
  await expect(
    page.getByRole("heading", { name: "Nada para mostrar neste período" }),
  ).toBeVisible();

  await scenario.selectOption("error");
  await expect(page.getByRole("button", { name: "Tentar novamente" })).toBeVisible();
});

test("movimento não essencial é reduzido para teclado e preferência do sistema", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");

  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--motion-fast"),
    ),
  ).toBe("0.01ms");

  await page.keyboard.press("Tab");
  await expect
    .poll(() => page.evaluate(() => document.documentElement.dataset.inputMode))
    .toBe("keyboard");
  await context.close();
});
