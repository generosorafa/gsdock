import { describe, expect, it } from "vitest";
import { initialPickingItems, products } from "./data/mock-data";
import { formatLocation, getPickingProgress, searchProducts } from "./domain";

describe("operações de domínio", () => {
  it("encontra produtos por SKU, nome e código de barras", () => {
    expect(searchProducts(products, "cam-pt-m")).toHaveLength(1);
    expect(searchProducts(products, "garrafa térmica")[0]?.sku).toBe("GAR-INOX-750");
    expect(searchProducts(products, "7891000000035")[0]?.name).toBe("Bolsa Canvas Weekender");
  });

  it("mantém todos os produtos quando a busca está vazia", () => {
    expect(searchProducts(products, "   ")).toHaveLength(products.length);
  });

  it("calcula o progresso consolidado da onda", () => {
    expect(getPickingProgress(initialPickingItems)).toEqual({
      picked: 8,
      required: 27,
      percentage: 30,
    });
  });

  it("formata um endereço operacional completo", () => {
    expect(formatLocation(products[0].locations[0])).toBe(
      "Estante A · Prateleira 03 · Caixa 07 · Posição 02",
    );
  });
});
