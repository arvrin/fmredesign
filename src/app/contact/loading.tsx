export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fef7f9] to-[#f5d4e0]">
      <div className="max-w-4xl mx-auto px-6 pt-40 pb-16 animate-pulse">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="h-8 bg-fm-magenta-600/10 rounded-full w-40" />
        </div>

        {/* Headline */}
        <div className="flex justify-center mb-4">
          <div className="h-12 bg-fm-magenta-600/10 rounded-lg w-1/2" />
        </div>
        <div className="flex justify-center mb-16">
          <div className="h-5 bg-fm-magenta-600/10 rounded w-2/3" />
        </div>

        {/* Contact form card */}
        <div className="bg-white/80 rounded-3xl p-10 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="h-4 bg-fm-neutral-200/60 rounded w-16 mb-2" />
              <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
            </div>
            <div>
              <div className="h-4 bg-fm-neutral-200/60 rounded w-16 mb-2" />
              <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
            </div>
          </div>
          <div className="mb-6">
            <div className="h-4 bg-fm-neutral-200/60 rounded w-20 mb-2" />
            <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
          </div>
          <div className="mb-6">
            <div className="h-4 bg-fm-neutral-200/60 rounded w-24 mb-2" />
            <div className="h-12 bg-fm-neutral-100/80 rounded-xl" />
          </div>
          <div className="mb-8">
            <div className="h-4 bg-fm-neutral-200/60 rounded w-20 mb-2" />
            <div className="h-32 bg-fm-neutral-100/80 rounded-xl" />
          </div>
          <div className="h-12 bg-fm-magenta-600/10 rounded-xl w-40" />
        </div>
      </div>
    </div>
  );
}
