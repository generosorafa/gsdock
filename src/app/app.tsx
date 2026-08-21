import { lazy, type ReactNode, Suspense, useEffect, useState } from "react";
import { AppShell } from "../components/app-shell";
import { PageSkeleton } from "../components/ui/skeleton";
import { StatePanel } from "../components/ui/state-panel";
import type { AppView, DemoScenario } from "../domain";

const DashboardPage = lazy(() => import("../pages/dashboard-page"));
const PickingPage = lazy(() => import("../pages/picking-page"));
const InventoryPage = lazy(() => import("../pages/inventory-page"));

export function App() {
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [scenario, setScenario] = useState<DemoScenario>("normal");
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const markKeyboard = () => {
      document.documentElement.dataset.inputMode = "keyboard";
    };
    const markPointer = () => {
      document.documentElement.dataset.inputMode = "pointer";
    };

    window.addEventListener("keydown", markKeyboard);
    window.addEventListener("pointerdown", markPointer);

    return () => {
      window.removeEventListener("keydown", markKeyboard);
      window.removeEventListener("pointerdown", markPointer);
    };
  }, []);

  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      setScenario("normal");
    }, 650);
  };

  let content: ReactNode;
  if (scenario === "loading") {
    content = <PageSkeleton />;
  } else if (scenario === "empty" || scenario === "error") {
    content = (
      <StatePanel
        state={scenario}
        onRetry={scenario === "error" ? retry : undefined}
        retrying={retrying}
      />
    );
  } else if (activeView === "picking") {
    content = <PickingPage />;
  } else if (activeView === "inventory") {
    content = <InventoryPage />;
  } else {
    content = <DashboardPage onNavigate={setActiveView} />;
  }

  return (
    <AppShell
      activeView={activeView}
      onNavigate={setActiveView}
      scenario={scenario}
      onScenarioChange={setScenario}
    >
      <Suspense fallback={<PageSkeleton />}>{content}</Suspense>
    </AppShell>
  );
}
