export const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "medium",
  timeStyle: "short",
})

export function SectionTitle({
  children,
  count,
}: {
  children: React.ReactNode
  count: number
}) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-black tracking-[-0.02em] text-primary-50">{children}</h2>
      <span className="rounded-sm border border-accent/40 bg-primary-800/60 px-2 py-0.5 text-[12px] font-bold text-accent-300">
        {count}
      </span>
    </div>
  )
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-accent/25 bg-primary-800/30 px-5 py-6 text-[14px] text-primary-300">
      {children}
    </p>
  )
}
