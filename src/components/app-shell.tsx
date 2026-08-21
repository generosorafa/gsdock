import {
  Boxes,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  LayoutDashboard,
  PackageSearch,
  RefreshCw,
  Settings,
  Warehouse,
} from "lucide-react";
import type { ReactNode } from "react";
import type { AppView, DemoScenario } from "../domain";
import { cn } from "../lib/cn";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type AppShellProps = {
  activeView: AppView;
  children: ReactNode;
  onNavigate: (view: AppView) => void;
  scenario: DemoScenario;
  onScenarioChange: (scenario: DemoScenario) => void;
};

const mainNavigation = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "picking" as const, label: "Separação", icon: ClipboardCheck, count: 4 },
  { id: "inventory" as const, label: "Estoque", icon: PackageSearch },
];

const secondaryNavigation = [
  { label: "Produtos", icon: Boxes },
  { label: "Integrações", icon: RefreshCw },
];

const scenarioOptions: Array<{ id: DemoScenario; label: string }> = [
  { id: "normal", label: "Dados prontos" },
  { id: "loading", label: "Carregando" },
  { id: "empty", label: "Sem dados" },
  { id: "error", label: "Com erro" },
];

export function AppShell({
  activeView,
  children,
  onNavigate,
  scenario,
  onScenarioChange,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-[var(--line)] bg-[var(--sidebar)] px-4 py-5 lg:flex lg:flex-col">
        <div className="flex items-center gap-3 px-2">
          <div className="grid size-10 place-items-center rounded-xl bg-[var(--brand-strong)] text-white shadow-[0_8px_24px_rgba(8,75,73,0.2)]">
            <Warehouse aria-hidden="true" size={20} strokeWidth={2.1} />
          </div>
          <div>
            <p className="text-base font-black tracking-[-0.02em]">GSDock</p>
            <p className="text-xs text-[var(--ink-subtle)]">Centro operacional</p>
          </div>
        </div>

        <div className="mt-7 rounded-xl bg-white/70 p-3 shadow-[var(--shadow-sm)]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-[var(--ink)]">Depósito principal</p>
              <p className="mt-0.5 text-[11px] text-[var(--ink-subtle)]">São Paulo · SP</p>
            </div>
            <ChevronDown aria-hidden="true" size={15} className="text-[var(--ink-subtle)]" />
          </div>
        </div>

        <nav className="mt-7" aria-label="Navegação principal">
          <p className="px-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
            Operação
          </p>
          <div className="mt-2 space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeView;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold outline-none transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]",
                    isActive
                      ? "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
                      : "text-[var(--ink-muted)] hover:bg-white/75 hover:text-[var(--ink)]",
                  )}
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                  {item.count ? (
                    <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-[var(--brand-deep)] shadow-[var(--shadow-xs)]">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="mt-7 px-3 text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ink-subtle)]">
            Gestão
          </p>
          <div className="mt-2 space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[var(--ink-subtle)] outline-none transition-colors duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:bg-white/75 hover:text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                  title="Disponível em uma próxima etapa"
                >
                  <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  <Badge className="ml-auto px-2" tone="neutral">
                    Em breve
                  </Badge>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto border-t border-[var(--line)] pt-4">
          <button
            type="button"
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-[var(--ink-muted)] outline-none transition-colors duration-[var(--motion-fast)] hover:bg-white/75 hover:text-[var(--ink)] focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
          >
            <Settings aria-hidden="true" size={18} />
            Configurações
          </button>
          <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="grid size-9 place-items-center rounded-full bg-[#d9eee9] text-xs font-black text-[var(--brand-deep)]">
              RG
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold">Rafael Generoso</p>
              <p className="truncate text-[11px] text-[var(--ink-subtle)]">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--canvas)]/92 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="grid size-9 place-items-center rounded-xl bg-[var(--brand-strong)] text-white">
                <Warehouse aria-hidden="true" size={18} />
              </div>
              <div>
                <p className="text-sm font-black">GSDock</p>
                <p className="text-[10px] text-[var(--ink-subtle)]">Protótipo operacional</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <span
                className="inline-flex size-2 rounded-full bg-[var(--success)]"
                aria-hidden="true"
              />
              <span className="text-xs font-semibold text-[var(--ink-muted)]">
                Dados de demonstração
              </span>
            </div>

            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="demo-scenario">
                Estado dos dados no protótipo
              </label>
              <select
                id="demo-scenario"
                className="h-10 max-w-40 rounded-xl border-0 bg-white px-3 text-xs font-bold text-[var(--ink-muted)] shadow-[var(--shadow-sm)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                value={scenario}
                onChange={(event) => onScenarioChange(event.target.value as DemoScenario)}
              >
                {scenarioOptions.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button variant="secondary" size="icon" aria-label="Central de ajuda">
                <CircleHelp aria-hidden="true" size={18} />
              </Button>
            </div>
          </div>
        </header>

        <main
          id="main-content"
          className="mx-auto max-w-[1440px] px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-10"
        >
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 rounded-2xl bg-[#102f30]/96 p-1.5 shadow-[0_16px_40px_rgba(8,34,35,0.28)] backdrop-blur-xl lg:hidden"
        aria-label="Navegação móvel"
      >
        {mainNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[10px] font-bold outline-none transition-colors duration-[var(--motion-fast)] focus-visible:ring-2 focus-visible:ring-white",
                isActive ? "bg-white text-[var(--brand-deep)]" : "text-white/65 hover:text-white",
              )}
            >
              <Icon aria-hidden="true" size={19} strokeWidth={isActive ? 2.2 : 1.7} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
