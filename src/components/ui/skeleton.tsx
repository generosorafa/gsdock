import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("skeleton rounded-lg", className)} aria-hidden="true" {...props} />;
}

export function PageSkeleton() {
  const metricSkeletons = ["orders", "units", "skus", "exceptions"];
  const rowSkeletons = ["first", "second", "third", "fourth"];

  return (
    <div className="space-y-6" aria-busy="true" aria-label="Carregando conteúdo" role="status">
      <div className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricSkeletons.map((skeleton) => (
          <div className="surface-card space-y-5 p-5" key={skeleton}>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
      <div className="surface-card space-y-4 p-5">
        <Skeleton className="h-6 w-48" />
        {rowSkeletons.map((skeleton) => (
          <Skeleton className="h-16 w-full" key={skeleton} />
        ))}
      </div>
      <span className="sr-only">Carregando dados de demonstração.</span>
    </div>
  );
}
