export default function Skeleton({ className = '', variant = 'rect' }: { className?: string; variant?: 'rect' | 'circle' | 'text' }) {
  return (
    <div
      className={`relative overflow-hidden bg-parchment ${variant === 'circle' ? 'rounded-full' : 'rounded-sm'} ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ochre/6 to-transparent animate-shimmer" />
    </div>
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="card-static p-6 space-y-4">
      <Skeleton className="h-5 w-24" />
      <Skeleton className="h-8 w-3/4" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
      <Skeleton className="h-10 w-32 mt-4" />
    </div>
  )
}

export function EmptyState({
  message,
  accent,
}: {
  message: string
  accent?: string
}) {
  return (
    <div className="py-16 text-center">
      <p className="text-ink-soft text-lg">
        {accent && (
          <>
            <span className="font-display font-soft-italic text-ochre">{accent}</span>
            {' '}
          </>
        )}
        {message}
      </p>
    </div>
  )
}
