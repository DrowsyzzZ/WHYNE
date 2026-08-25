export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="container-whyne grid min-h-[calc(100dvh-64px)] place-items-center py-16">
      <section className="text-center"><p className="text-sm font-semibold text-primary">WHYNE</p><h1 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h1><p className="mt-3 text-gray-600">이 화면은 해당 기능 이슈에서 구현됩니다.</p></section>
    </main>
  );
}
