export default function Loading() {
  return (
    <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/5] bg-mist mb-3" />
            <div className="h-3 bg-mist w-3/4 mb-2" />
            <div className="h-3 bg-mist w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
