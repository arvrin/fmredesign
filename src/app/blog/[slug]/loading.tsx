export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-3xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Back link placeholder */}
        <div className="h-4 bg-fm-magenta-600/10 rounded w-28 mb-8" />

        {/* Category badge */}
        <div className="h-8 bg-fm-magenta-600/10 rounded-full w-32 mb-6" />

        {/* Title */}
        <div className="h-10 bg-fm-magenta-600/10 rounded-lg w-full mb-3" />
        <div className="h-10 bg-fm-magenta-600/10 rounded-lg w-3/4 mb-6" />

        {/* Meta row */}
        <div className="flex gap-4 mb-6">
          <div className="h-4 bg-fm-magenta-600/10 rounded w-32" />
          <div className="h-4 bg-fm-magenta-600/10 rounded w-36" />
          <div className="h-4 bg-fm-magenta-600/10 rounded w-24" />
        </div>

        {/* Tags */}
        <div className="flex gap-2 mb-10">
          <div className="h-6 bg-fm-magenta-600/10 rounded-full w-20" />
          <div className="h-6 bg-fm-magenta-600/10 rounded-full w-16" />
          <div className="h-6 bg-fm-magenta-600/10 rounded-full w-24" />
        </div>

        {/* Article card */}
        <div className="bg-white/80 rounded-3xl p-8 md:p-12 shadow-sm">
          <div className="space-y-4">
            <div className="h-7 bg-fm-neutral-200/60 rounded w-2/3 mb-6" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-5/6" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-4/6 mb-4" />

            <div className="h-6 bg-fm-neutral-200/60 rounded w-1/2 mt-8 mb-4" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-3/4" />

            <div className="h-6 bg-fm-neutral-200/60 rounded w-2/5 mt-8 mb-4" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-5/6" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
