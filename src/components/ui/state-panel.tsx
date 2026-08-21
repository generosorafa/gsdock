import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

type StatePanelProps = {
  state: "empty" | "error";
  onRetry?: () => void;
  retrying?: boolean;
};

export function StatePanel({ state, onRetry, retrying = false }: StatePanelProps) {
  const isError = state === "error";
  const Icon = isError ? AlertTriangle : Inbox;

  return (
    <Card className="flex min-h-80 flex-col items-center justify-center p-8 text-center">
      <div
        className={`mb-5 grid size-12 place-items-center rounded-2xl ${
          isError
            ? "bg-[var(--danger-soft)] text-[var(--danger)]"
            : "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
        }`}
      >
        <Icon aria-hidden="true" size={22} strokeWidth={1.8} />
      </div>
      <h2 className="text-lg font-bold text-[var(--ink)]">
        {isError ? "Não foi possível carregar os dados" : "Nada para mostrar neste período"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--ink-muted)]">
        {isError
          ? "A simulação reproduz uma falha de sincronização. Os últimos dados seguros continuam preservados."
          : "Quando novos pedidos elegíveis chegarem, a operação aparecerá aqui automaticamente."}
      </p>
      {isError && onRetry ? (
        <Button
          className="mt-6 min-w-40"
          onClick={onRetry}
          disabled={retrying}
          aria-busy={retrying}
        >
          <RefreshCw aria-hidden="true" className={retrying ? "animate-spin" : ""} size={16} />
          {retrying ? "Tentando novamente" : "Tentar novamente"}
        </Button>
      ) : null}
    </Card>
  );
}
