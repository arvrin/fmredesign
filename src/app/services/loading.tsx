export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="h-8 bg-fm-magenta-600/10 rounded-full w-52" />
        </div>

        {/* Headline */}
        <div className="flex justify-center mb-4">
          <div className="h-12 bg-fm-magenta-600/10 rounded-lg w-3/5" />
        </div>
        <div className="flex justify-center mb-16">
          <div className="h-5 bg-fm-magenta-600/10 rounded w-2/3" />
        </div>

        {/* Service cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white/80 rounded-2xl p-8 shadow-sm">
              <div className="h-14 w-14 bg-fm-magenta-600/10 rounded-xl mb-6" />
              <div className="h-6 bg-fm-neutral-200/60 rounded w-2/3 mb-3" />
              <div className="h-4 bg-fm-neutral-200/60 rounded w-full mb-2" />
              <div className="h-4 bg-fm-neutral-200/60 rounded w-5/6 mb-2" />
              <div className="h-4 bg-fm-neutral-200/60 rounded w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
