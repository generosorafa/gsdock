import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  MapPin,
  PackageOpen,
  ScanLine,
} from "lucide-react";
import { type CSSProperties, useMemo, useState } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { initialPickingItems } from "../data/mock-data";
import { getPickingProgress, type PickingItem } from "../domain";
import { cn } from "../lib/cn";

type PickingFilter = "all" | "pending" | "exceptions";

const filterOptions: Array<{ id: PickingFilter; label: string }> = [
  { id: "all", label: "Todos" },
  { id: "pending", label: "Para separar" },
  { id: "exceptions", label: "Exceções" },
];

function statusFor(item: PickingItem) {
  if (item.status === "done") {
    return <Badge tone="success">Separado</Badge>;
  }

  if (item.exception === "missing_location") {
    return <Badge tone="warning">Sem localização</Badge>;
  }

  if (item.exception === "insufficient_stock") {
    return <Badge tone="danger">Estoque insuficiente</Badge>;
  }

  if (item.status === "in_progress") {
    return <Badge tone="brand">Em andamento</Badge>;
  }

  return <Badge tone="neutral">Pendente</Badge>;
}

export default function PickingPage() {
  const [items, setItems] = useState(initialPickingItems);
  const [activeFilter, setActiveFilter] = useState<PickingFilter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("Lista pronta para separação.");
  const progress = getPickingProgress(items);

  const visibleItems = useMemo(() => {
    if (activeFilter === "exceptions") {
      return items.filter((item) => item.status === "exception");
    }

    if (activeFilter === "pending") {
      return items.filter((item) => item.status !== "done" && item.status !== "exception");
    }

    return items;
  }, [activeFilter, items]);

  const confirmItem = (item: PickingItem) => {
    if (busyId || item.status === "done" || item.status === "exception") {
      return;
    }

    setBusyId(item.id);
    setFeedback(`Confirmando ${item.sku}...`);

    window.setTimeout(() => {
      setItems((current) =>
        current.map((candidate) =>
          candidate.id === item.id
            ? { ...candidate, picked: candidate.required, status: "done" }
            : candidate,
        ),
      );
      setBusyId(null);
      setFeedback(`${item.sku} separado com sucesso.`);
    }, 480);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Onda das 14h · 22 pedidos</p>
          <h1 className="page-title">Separação do dia</h1>
          <p className="page-description">
            Produtos agrupados por SKU, com quantidade total e primeiro endereço de coleta.
          </p>
        </div>
        <Button
          variant="secondary"
          disabled
          title="Leitura por câmera ou leitor em uma próxima etapa"
        >
          <ScanLine aria-hidden="true" size={17} />
          Ler código
          <Badge className="ml-1 bg-white" tone="neutral">
            Em breve
          </Badge>
        </Button>
      </section>

      <Card className="overflow-hidden">
        <div className="grid gap-5 p-5 sm:grid-cols-[auto_1fr] sm:items-center sm:p-6">
          <div
            className="progress-ring progress-ring--compact"
            style={{ "--progress": `${progress.percentage * 3.6}deg` } as CSSProperties}
            aria-label={`${progress.percentage}% da separação concluída`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={progress.percentage}
            role="progressbar"
          >
            <div className="progress-ring__inner">
              <span className="text-xl font-black">{progress.percentage}%</span>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold">Progresso da onda</p>
                <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                  {progress.picked} de {progress.required} unidades confirmadas
                </p>
              </div>
              <Badge tone={progress.percentage === 100 ? "success" : "brand"}>
                {progress.percentage === 100 ? "Concluída" : "Em andamento"}
              </Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
              <div
                className="progress-fill h-full rounded-full bg-[var(--brand-strong)]"
                style={{ transform: `scaleX(${progress.percentage / 100})` }}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-[var(--line)] px-5 py-3 sm:px-6">
          <p
            className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)]"
            aria-live="polite"
          >
            <ClipboardCheck aria-hidden="true" size={15} className="text-[var(--brand-strong)]" />
            {feedback}
          </p>
        </div>
      </Card>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex rounded-xl bg-white p-1 shadow-[var(--shadow-sm)]">
            <legend className="sr-only">Filtrar lista</legend>
            {filterOptions.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                aria-pressed={activeFilter === option.id}
                className={cn(
                  "min-h-9 rounded-lg px-3 text-xs font-bold outline-none transition-colors duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
                  activeFilter === option.id
                    ? "bg-[var(--brand-deep)] text-white"
                    : "text-[var(--ink-muted)] hover:bg-[var(--surface-muted)]",
                )}
              >
                {option.label}
              </button>
            ))}
          </fieldset>
          <p className="text-xs font-semibold text-[var(--ink-subtle)]">
            {visibleItems.length} SKUs exibidos
          </p>
        </div>

        <div className="mt-4 space-y-3">
          {visibleItems.length === 0 ? (
            <Card className="grid min-h-48 place-items-center p-8 text-center">
              <div>
                <CheckCircle2 className="mx-auto text-[var(--success)]" size={28} />
                <p className="mt-3 text-sm font-bold">Nenhum item neste filtro</p>
                <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                  A separação pendente está em dia.
                </p>
              </div>
            </Card>
          ) : (
            visibleItems.map((item) => {
              const isBusy = busyId === item.id;
              const canConfirm = item.status !== "done" && item.status !== "exception";

              return (
                <Card className="p-4 sm:p-5" key={item.id}>
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(14rem,.85fr)_auto] lg:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={cn(
                          "grid size-11 shrink-0 place-items-center rounded-xl",
                          item.status === "exception"
                            ? "bg-[var(--danger-soft)] text-[var(--danger)]"
                            : item.status === "done"
                              ? "bg-[var(--success-soft)] text-[var(--success)]"
                              : "bg-[var(--brand-soft)] text-[var(--brand-deep)]",
                        )}
                      >
                        {item.status === "exception" ? (
                          <AlertTriangle aria-hidden="true" size={19} />
                        ) : item.status === "done" ? (
                          <Check aria-hidden="true" size={19} />
                        ) : (
                          <PackageOpen aria-hidden="true" size={19} />
                        )}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono text-xs font-black tracking-[0.04em] text-[var(--brand-deep)]">
                            {item.sku}
                          </p>
                          {statusFor(item)}
                        </div>
                        <h2 className="mt-1 truncate text-sm font-bold sm:text-base">
                          {item.name}
                        </h2>
                        <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                          {item.variant} · {item.orderCount} pedidos
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--ink-subtle)]">
                          Pegar
                        </p>
                        <p className="mt-1 text-2xl font-black">
                          {item.required}
                          <span className="ml-1 text-xs font-semibold text-[var(--ink-subtle)]">
                            un.
                          </span>
                        </p>
                      </div>
                      <div className="rounded-xl bg-[var(--surface-muted)] p-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[var(--ink-subtle)]">
                          Local
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 font-mono text-xs font-black">
                          <MapPin
                            aria-hidden="true"
                            size={14}
                            className="text-[var(--brand-strong)]"
                          />
                          {item.locationCode ?? "Não definido"}
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-44">
                      {canConfirm ? (
                        <Button
                          className="w-full"
                          disabled={Boolean(busyId)}
                          aria-busy={isBusy}
                          onClick={() => confirmItem(item)}
                        >
                          {isBusy ? (
                            <LoaderCircle aria-hidden="true" className="animate-spin" size={16} />
                          ) : (
                            <Check aria-hidden="true" size={16} />
                          )}
                          {isBusy ? "Confirmando" : "Confirmar"}
                        </Button>
                      ) : item.status === "done" ? (
                        <div className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--success-soft)] px-4 text-sm font-bold text-[var(--success)]">
                          <CheckCircle2 aria-hidden="true" size={16} />
                          Confirmado
                        </div>
                      ) : (
                        <Button className="w-full" variant="danger">
                          Resolver exceção
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
