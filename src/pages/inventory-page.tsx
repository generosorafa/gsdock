import {
  AlertTriangle,
  Barcode,
  Boxes,
  MapPin,
  PackageCheck,
  Search,
  Warehouse,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { products } from "../data/mock-data";
import { formatLocation, searchProducts } from "../domain";
import { cn } from "../lib/cn";

export default function InventoryPage() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchProducts(products, query), [query]);
  const selected = matches[0];

  return (
    <div className="space-y-6">
      <section>
        <p className="eyebrow">Consulta operacional</p>
        <h1 className="page-title">Localização de estoque</h1>
        <p className="page-description">
          Pesquise por SKU, nome ou código de barras para encontrar saldo e endereço físico.
        </p>
      </section>

      <Card className="p-4 sm:p-6">
        <label
          className="text-xs font-black uppercase tracking-[0.1em] text-[var(--ink-muted)]"
          htmlFor="inventory-search"
        >
          Produto
        </label>
        <div className="relative mt-2">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-subtle)]"
            size={19}
          />
          <input
            id="inventory-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-14 w-full rounded-2xl border border-[var(--line-strong)] bg-white pl-12 pr-4 text-base font-semibold outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus:border-[var(--brand-strong)] focus:ring-4 focus:ring-[var(--brand-soft)]"
            placeholder="Ex.: CAM-PT-M ou Camiseta Essential"
            autoComplete="off"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[var(--ink-subtle)]">Experimente:</span>
          {products.slice(0, 3).map((product) => (
            <button
              type="button"
              key={product.id}
              onClick={() => setQuery(product.sku)}
              className="rounded-lg bg-[var(--surface-muted)] px-2.5 py-1.5 font-mono text-[11px] font-black text-[var(--ink-muted)] outline-none transition-colors duration-[var(--motion-fast)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-deep)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
            >
              {product.sku}
            </button>
          ))}
        </div>
      </Card>

      {!selected ? (
        <Card className="grid min-h-72 place-items-center p-8 text-center" role="status">
          <div>
            <Search className="mx-auto text-[var(--ink-subtle)]" size={30} strokeWidth={1.6} />
            <h2 className="mt-4 text-base font-bold">Nenhum produto encontrado</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--ink-muted)]">
              Confira o SKU, nome ou código de barras e tente novamente.
            </p>
          </div>
        </Card>
      ) : (
        <section
          className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,.6fr)]"
          aria-live="polite"
        >
          <Card className="overflow-hidden">
            <div className="border-b border-[var(--line)] p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand-deep)]">
                    <Boxes aria-hidden="true" size={22} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-black tracking-[0.05em] text-[var(--brand-deep)]">
                      {selected.sku}
                    </p>
                    <h2 className="mt-1 text-lg font-black tracking-[-0.02em]">{selected.name}</h2>
                    <p className="mt-1 text-sm text-[var(--ink-subtle)]">{selected.variant}</p>
                  </div>
                </div>
                <Badge tone={selected.locations.length ? "success" : "warning"}>
                  {selected.locations.length
                    ? `${selected.locations.length} localização(ões)`
                    : "Sem endereço"}
                </Badge>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2.5 text-xs text-[var(--ink-muted)]">
                <Barcode aria-hidden="true" size={16} />
                <span className="font-mono font-bold">{selected.barcode}</span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="section-kicker">Endereços físicos</p>
                  <h3 className="section-title">Onde encontrar</h3>
                </div>
                <Badge tone="neutral">Prioridade de coleta</Badge>
              </div>

              {selected.locations.length ? (
                <div className="mt-5 space-y-3">
                  {[...selected.locations]
                    .sort((a, b) => a.priority - b.priority)
                    .map((location, index) => (
                      <div
                        className={cn(
                          "grid gap-4 rounded-2xl border p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center",
                          index === 0
                            ? "border-[var(--brand-line)] bg-[var(--brand-wash)]"
                            : "border-[var(--line)] bg-white",
                        )}
                        key={location.id}
                      >
                        <span className="grid size-10 place-items-center rounded-xl bg-white text-[var(--brand-deep)] shadow-[var(--shadow-xs)]">
                          <MapPin aria-hidden="true" size={18} />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-sm font-black">{location.code}</p>
                            {index === 0 ? <Badge tone="brand">Pegar primeiro</Badge> : null}
                            {location.kind === "reserve" ? (
                              <Badge tone="neutral">Reserva</Badge>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                            {formatLocation(location)}
                          </p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xl font-black">{location.quantity}</p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--ink-subtle)]">
                            unidades
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-[var(--warning-line)] bg-[var(--warning-soft)] p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 shrink-0 text-[var(--warning)]" size={19} />
                    <div>
                      <p className="text-sm font-bold text-[var(--warning)]">
                        Localização ainda não cadastrada
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
                        O saldo existe no Bling, mas o endereço de estante, prateleira e caixa
                        precisa ser definido no GSDock.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-4">
            <Card className="p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
                  <PackageCheck aria-hidden="true" size={19} />
                </span>
                <div>
                  <p className="text-sm font-bold">Resumo de estoque</p>
                  <p className="text-xs text-[var(--ink-subtle)]">Dados demonstrativos</p>
                </div>
              </div>
              <dl className="mt-6 space-y-4">
                <div className="flex items-end justify-between border-b border-[var(--line)] pb-3">
                  <dt className="text-sm text-[var(--ink-muted)]">Físico</dt>
                  <dd className="text-xl font-black">{selected.physical}</dd>
                </div>
                <div className="flex items-end justify-between border-b border-[var(--line)] pb-3">
                  <dt className="text-sm text-[var(--ink-muted)]">Reservado</dt>
                  <dd className="text-xl font-black">{selected.reserved}</dd>
                </div>
                <div className="flex items-end justify-between">
                  <dt className="text-sm font-bold text-[var(--ink)]">Disponível</dt>
                  <dd
                    className={cn(
                      "text-3xl font-black",
                      selected.available ? "text-[var(--success)]" : "text-[var(--danger)]",
                    )}
                  >
                    {selected.available}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Warehouse className="mt-0.5 shrink-0 text-[var(--brand-strong)]" size={19} />
                <div>
                  <p className="text-sm font-bold">Depósito principal</p>
                  <p className="mt-1 text-xs leading-5 text-[var(--ink-subtle)]">
                    O Bling será a fonte do saldo por depósito. O endereço detalhado será mantido
                    pelo GSDock.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
