export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="h-8 bg-fm-magenta-600/10 rounded-full w-48" />
        </div>

        {/* Headline */}
        <div className="flex justify-center mb-4">
          <div className="h-12 bg-fm-magenta-600/10 rounded-lg w-3/5" />
        </div>
        <div className="flex justify-center mb-16">
          <div className="h-5 bg-fm-magenta-600/10 rounded w-2/3" />
        </div>

        {/* Multi-step form card */}
        <div className="bg-white/80 rounded-3xl p-10 shadow-sm">
          {/* Progress steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-10 w-10 bg-fm-magenta-600/10 rounded-full" />
                {i < 4 && <div className="h-0.5 w-12 bg-fm-neutral-200/60" />}
              </div>
            ))}
          </div>

          {/* Form fields */}
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-fm-neutral-200/60 rounded w-32 mb-2" />
              <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
            </div>
            <div>
              <div className="h-4 bg-fm-neutral-200/60 rounded w-28 mb-2" />
              <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
            </div>
            <div>
              <div className="h-4 bg-fm-neutral-200/60 rounded w-36 mb-2" />
              <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
            </div>
            <div className="flex justify-end pt-4">
              <div className="h-12 bg-fm-magenta-600/10 rounded-xl w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
