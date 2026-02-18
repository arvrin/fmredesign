export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="h-8 bg-fm-magenta-600/10 rounded-full w-44" />
        </div>

        {/* Headline */}
        <div className="flex justify-center mb-4">
          <div className="h-12 bg-fm-magenta-600/10 rounded-lg w-2/3" />
        </div>
        <div className="flex justify-center mb-16">
          <div className="h-5 bg-fm-magenta-600/10 rounded w-3/4" />
        </div>

        {/* Story card */}
        <div className="bg-white/80 rounded-3xl p-10 shadow-sm mb-12">
          <div className="h-7 bg-fm-neutral-200/60 rounded w-1/3 mb-6" />
          <div className="space-y-3">
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-5/6" />
            <div className="h-4 bg-fm-neutral-200/60 rounded w-4/6" />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white/80 rounded-2xl p-6 shadow-sm">
              <div className="h-10 bg-fm-magenta-600/10 rounded w-16 mb-3 mx-auto" />
              <div className="h-4 bg-fm-neutral-200/60 rounded w-24 mx-auto" />
            </div>
          ))}
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/80 rounded-2xl p-6 shadow-sm">
              <div className="h-24 w-24 bg-fm-magenta-600/10 rounded-full mx-auto mb-4" />
              <div className="h-5 bg-fm-neutral-200/60 rounded w-1/2 mx-auto mb-2" />
              <div className="h-4 bg-fm-neutral-200/60 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
