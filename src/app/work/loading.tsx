export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="h-8 bg-fm-magenta-600/10 rounded-full w-48" />
        </div>

        {/* Headline */}
        <div className="flex justify-center mb-4">
          <div className="h-12 bg-fm-magenta-600/10 rounded-lg w-2/3" />
        </div>
        <div className="flex justify-center mb-12">
          <div className="h-5 bg-fm-magenta-600/10 rounded w-1/2" />
        </div>

        {/* Filter tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 bg-fm-magenta-600/10 rounded-full w-24" />
          ))}
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/80 rounded-2xl overflow-hidden shadow-sm">
              <div className="h-48 bg-fm-magenta-600/10" />
              <div className="p-6 space-y-3">
                <div className="h-5 bg-fm-neutral-200/60 rounded-full w-20" />
                <div className="h-6 bg-fm-neutral-200/60 rounded w-3/4" />
                <div className="h-4 bg-fm-neutral-200/60 rounded w-full" />
                <div className="h-4 bg-fm-neutral-200/60 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
