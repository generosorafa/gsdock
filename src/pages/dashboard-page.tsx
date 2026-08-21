import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPinOff,
  PackageCheck,
  TrendingUp,
} from "lucide-react";
import type { CSSProperties } from "react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { dashboardMetrics, initialPickingItems } from "../data/mock-data";
import type { AppView } from "../domain";
import { getPickingProgress } from "../domain";

type DashboardPageProps = {
  onNavigate: (view: AppView) => void;
};

const metricTone = {
  neutral: "bg-[var(--surface-muted)] text-[var(--ink-muted)]",
  brand: "bg-[var(--brand-soft)] text-[var(--brand-deep)]",
  warning: "bg-[var(--warning-soft)] text-[var(--warning)]",
  danger: "bg-[var(--danger-soft)] text-[var(--danger)]",
};

const hourlyVolume = [
  { hour: "08h", value: 34 },
  { hour: "10h", value: 52 },
  { hour: "12h", value: 44 },
  { hour: "14h", value: 78 },
  { hour: "16h", value: 62 },
  { hour: "18h", value: 46 },
];

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const progress = getPickingProgress(initialPickingItems);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">Visão do dia · 21 ago 2026</p>
          <h1 className="page-title">Bom dia, Rafael.</h1>
          <p className="page-description">
            Aqui está o que precisa da sua atenção antes do próximo corte.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">
            <CheckCircle2 aria-hidden="true" className="mr-1" size={13} />
            Bling sincronizado
          </Badge>
          <span className="text-xs font-medium text-[var(--ink-subtle)]">há 4 minutos</span>
        </div>
      </section>

      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Indicadores operacionais"
      >
        {dashboardMetrics.map((metric) => (
          <button
            type="button"
            key={metric.id}
            className="surface-card group min-h-40 p-5 text-left outline-none transition-[box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)] focus-visible:ring-2 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-2"
            onClick={() => onNavigate(metric.target)}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-semibold text-[var(--ink-muted)]">{metric.label}</span>
              <span
                className={`grid size-8 place-items-center rounded-lg ${metricTone[metric.tone]}`}
              >
                <TrendingUp aria-hidden="true" size={15} />
              </span>
            </div>
            <p className="mt-4 text-4xl font-black tracking-[-0.05em] text-[var(--ink)]">
              {metric.value}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-xs font-medium text-[var(--ink-subtle)]">{metric.detail}</span>
              <ArrowRight
                aria-hidden="true"
                size={15}
                className="text-[var(--ink-subtle)] transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)] group-hover:translate-x-0.5"
              />
            </div>
          </button>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Onda atual</p>
              <h2 className="section-title">Separação das 14h</h2>
              <p className="mt-1 text-sm text-[var(--ink-muted)]">
                22 pedidos · 4 SKUs · responsável: você
              </p>
            </div>
            <Badge tone="brand">Em andamento</Badge>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div
              className="progress-ring"
              style={{ "--progress": `${progress.percentage * 3.6}deg` } as CSSProperties}
              aria-label={`${progress.percentage}% da separação concluída`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress.percentage}
              role="progressbar"
            >
              <div className="progress-ring__inner">
                <span className="text-2xl font-black tracking-[-0.04em]">
                  {progress.percentage}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink-subtle)]">
                  concluído
                </span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[var(--surface-muted)] p-4">
                  <p className="text-2xl font-black">{progress.picked}</p>
                  <p className="mt-1 text-xs text-[var(--ink-subtle)]">unidades separadas</p>
                </div>
                <div className="rounded-xl bg-[var(--surface-muted)] p-4">
                  <p className="text-2xl font-black">{progress.required - progress.picked}</p>
                  <p className="mt-1 text-xs text-[var(--ink-subtle)]">unidades restantes</p>
                </div>
              </div>
              <Button className="mt-4 w-full sm:w-auto" onClick={() => onNavigate("picking")}>
                Continuar separação
                <ArrowRight aria-hidden="true" size={16} />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Ritmo de entrada</p>
              <h2 className="section-title">Pedidos por horário</h2>
            </div>
            <Badge tone="neutral">Hoje</Badge>
          </div>
          <div
            className="mt-7 flex h-44 items-end justify-between gap-2"
            aria-label="Volume de pedidos por horário"
            role="img"
          >
            {hourlyVolume.map((point) => (
              <div
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                key={point.hour}
              >
                <span className="sr-only">
                  {point.value} pedidos às {point.hour}
                </span>
                <div
                  className="w-full max-w-9 rounded-t-md bg-[var(--brand-soft)] shadow-[inset_0_-1px_0_rgba(8,75,73,0.12)]"
                  style={{ height: `${point.value}%` }}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-bold text-[var(--ink-subtle)]">{point.hour}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-5 sm:px-6">
            <div>
              <p className="section-kicker">Prioridades</p>
              <h2 className="section-title">Resolva antes de continuar</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("picking")}>
              Ver todas
            </Button>
          </div>
          <div className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
            <button
              type="button"
              className="group flex w-full items-center gap-4 px-5 py-4 text-left outline-none transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-muted)] focus-visible:bg-[var(--surface-muted)] sm:px-6"
              onClick={() => onNavigate("inventory")}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
                <AlertCircle aria-hidden="true" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">Estoque insuficiente em BOL-CAN-MAR</span>
                <span className="mt-1 block text-xs text-[var(--ink-subtle)]">
                  Falta 1 unidade para 5 pedidos
                </span>
              </span>
              <ArrowRight aria-hidden="true" size={16} className="text-[var(--ink-subtle)]" />
            </button>
            <button
              type="button"
              className="group flex w-full items-center gap-4 px-5 py-4 text-left outline-none transition-colors duration-[var(--motion-fast)] hover:bg-[var(--surface-muted)] focus-visible:bg-[var(--surface-muted)] sm:px-6"
              onClick={() => onNavigate("inventory")}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--warning-soft)] text-[var(--warning)]">
                <MapPinOff aria-hidden="true" size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">BON-AZU-U está sem localização</span>
                <span className="mt-1 block text-xs text-[var(--ink-subtle)]">
                  4 unidades aguardam endereçamento
                </span>
              </span>
              <ArrowRight aria-hidden="true" size={16} className="text-[var(--ink-subtle)]" />
            </button>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--success-soft)] text-[var(--success)]">
              <PackageCheck aria-hidden="true" size={19} />
            </span>
            <div>
              <p className="text-sm font-bold">Última sincronização</p>
              <p className="text-xs text-[var(--ink-subtle)]">Hoje às 10:42</p>
            </div>
          </div>
          <dl className="mt-6 space-y-4">
            <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3 text-sm">
              <dt className="text-[var(--ink-muted)]">Produtos</dt>
              <dd className="font-bold">1.284 atualizados</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--line)] pb-3 text-sm">
              <dt className="text-[var(--ink-muted)]">Pedidos</dt>
              <dd className="font-bold">22 elegíveis</dd>
            </div>
            <div className="flex justify-between gap-4 text-sm">
              <dt className="text-[var(--ink-muted)]">Duração</dt>
              <dd className="font-bold">18 segundos</dd>
            </div>
          </dl>
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-[var(--surface-muted)] px-3 py-2.5 text-xs text-[var(--ink-muted)]">
            <Clock3 aria-hidden="true" size={15} />
            Próxima reconciliação às 10:57
          </div>
        </Card>
      </section>
    </div>
  );
}
