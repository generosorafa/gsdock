export type DemoScenario = "normal" | "loading" | "empty" | "error";

export type AppView = "dashboard" | "picking" | "inventory";

export type Location = {
  id: string;
  code: string;
  rack: string;
  shelf: string;
  bin: string;
  position: string;
  quantity: number;
  kind: "picking" | "reserve";
  priority: number;
};

export type Product = {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  variant: string;
  physical: number;
  reserved: number;
  available: number;
  toPick: number;
  locations: Location[];
};

export type PickingItem = {
  id: string;
  productId: string;
  sku: string;
  name: string;
  variant: string;
  required: number;
  picked: number;
  orderCount: number;
  locationCode: string | null;
  stockAvailable: number;
  status: "pending" | "in_progress" | "done" | "exception";
  exception?: "missing_location" | "insufficient_stock";
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: number;
  detail: string;
  tone: "neutral" | "brand" | "warning" | "danger";
  target: AppView;
};

export function formatLocation(location: Location): string {
  return `${location.rack} · ${location.shelf} · ${location.bin} · ${location.position}`;
}

export function searchProducts(products: Product[], query: string): Product[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");

  if (!normalizedQuery) {
    return products;
  }

  return products.filter((product) => {
    const searchable = [product.sku, product.barcode, product.name, product.variant]
      .join(" ")
      .toLocaleLowerCase("pt-BR");

    return searchable.includes(normalizedQuery);
  });
}

export function getPickingProgress(items: PickingItem[]): {
  picked: number;
  required: number;
  percentage: number;
} {
  const totals = items.reduce(
    (result, item) => ({
      picked: result.picked + item.picked,
      required: result.required + item.required,
    }),
    { picked: 0, required: 0 },
  );

  return {
    ...totals,
    percentage: totals.required === 0 ? 0 : Math.round((totals.picked / totals.required) * 100),
  };
}
