import { Link } from "react-router-dom";

export default function Home() {
  // MOCK: dados de exemplo (substitua depois por dados reais da API)
  const today = new Date().toLocaleDateString();
  const quickActions = [
    { label: "Novo exercício", to: "/exercises/new" },
    { label: "Novo dia de treino", to: "/metrics/new" },
    { label: "Nova sessão", to: "/session/new" },
  ];
  const todaysPlan = {
    name: "Lower Body (Força)",
    notes: "Foque em técnica no agachamento. Aquecimento: 10 min bike.",
    exercises: [
      { name: "Agachamento livre", sets: 5, reps: "5", load: "80 kg" },
      { name: "Levantamento terra", sets: 3, reps: "5", load: "100 kg" },
      { name: "Leg press", sets: 4, reps: "8–10", load: "180 kg" },
      { name: "Panturrilha em pé", sets: 4, reps: "12–15", load: "—" },
    ],
  };
  const recentSessions = [
    { id: 1, date: "29/10/2025", title: "Upper (Empurrar)", vol: "12.4k kg", duration: "58 min" },
    { id: 2, date: "28/10/2025", title: "Cardio + Core", vol: "—", duration: "40 min" },
    { id: 3, date: "27/10/2025", title: "Upper (Puxar)", vol: "10.2k kg", duration: "54 min" },
  ];
  const topExercises = [
    { name: "Supino reto", best: "5×5 @ 70 kg", last: "30/10/2025" },
    { name: "Agachamento", best: "5×5 @ 85 kg", last: "27/10/2025" },
    { name: "Remada curvada", best: "4×8 @ 45 kg", last: "27/10/2025" },
    { name: "Desenvolvimento", best: "5×5 @ 40 kg", last: "29/10/2025" },
  ];
  const goals = [
    { label: "Treinos/semana", target: 4, current: 3 },
    { label: "Volume semanal", target: 45000, current: 37200 }, // kg
    { label: "Cardio (min)", target: 120, current: 80 },
  ];

  return (
    <main className="w-full max-w-100vw max-h-100vh bg-white m-auto">
      {/* Header */}
      <section className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-black text-white grid place-items-center font-semibold">FT</div>
            <h1 className="text-xl font-semibold tracking-tight">FitTrack</h1>
          </div>
          <div className="ml-auto w-full sm:w-96">
            <label className="relative block">
              <span className="sr-only">Buscar</span>
              <span className="absolute inset-y-0 left-3 grid place-items-center">
                {/* ícone lupa */}
                <svg width="18" height="18" fill="none" stroke="currentColor" className="opacity-60">
                  <circle cx="8" cy="8" r="6" strokeWidth="2" />
                  <path d="M12 12l4 4" strokeWidth="2" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Buscar exercícios ou treinos…"
                className="w-full rounded-xl border px-9 py-2 outline-none focus:ring-2 focus:ring-black/30"
              />
            </label>
          </div>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="mx-auto max-w-7xl px-4 py-6">
        {/* Boas-vindas + ações rápidas */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Hoje • {today}</p>
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo de volta! Pronto para treinar?</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white transition-colors"
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Coluna esquerda (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Treino de hoje */}
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Treino de hoje</h3>
                  <p className="text-sm text-neutral-600">{todaysPlan.name}</p>
                </div>
                <Link
                  to="/session/new"
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  Iniciar treino
                </Link>
              </div>
              <p className="mb-4 text-sm text-neutral-700">{todaysPlan.notes}</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-neutral-500">
                    <tr className="[&>th]:py-2 [&>th]:font-medium">
                      <th>Exercício</th>
                      <th>Séries</th>
                      <th>Reps</th>
                      <th>Carga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {todaysPlan.exercises.map((ex) => (
                      <tr key={ex.name} className="[&>td]:py-2">
                        <td className="font-medium">{ex.name}</td>
                        <td>{ex.sets}</td>
                        <td>{ex.reps}</td>
                        <td>{ex.load}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Últimas sessões */}
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Últimas sessões</h3>
                <Link to="/sessions" className="text-sm font-medium text-neutral-700 hover:underline">
                  Ver todas
                </Link>
              </div>
              <ul className="divide-y">
                {recentSessions.map((s) => (
                  <li key={s.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{s.title}</p>
                        <p className="text-sm text-neutral-600">{s.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">Volume: <span className="font-medium">{s.vol}</span></p>
                        <p className="text-sm text-neutral-600">{s.duration}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Coluna direita (1/3) */}
          <div className="space-y-6">
            {/* Exercícios em destaque */}
            <div className="rounded-2xl border p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exercícios</h3>
                <Link to="/exercises" className="text-sm font-medium text-neutral-700 hover:underline">
                  Gerenciar
                </Link>
              </div>
              <ul className="space-y-3">
                {topExercises.map((e) => (
                  <li key={e.name} className="rounded-xl border p-3">
                    <p className="font-medium">{e.name}</p>
                    <p className="text-sm text-neutral-700">PR: {e.best}</p>
                    <p className="text-xs text-neutral-500">Último: {e.last}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Metas rápidas */}
            <div className="rounded-2xl border p-5">
              <h3 className="mb-4 text-lg font-semibold">Metas da semana</h3>
              <div className="space-y-4">
                {goals.map((g) => {
                  const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                  return (
                    <div key={g.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-neutral-700">{g.label}</span>
                        <span className="font-medium">{pct}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-neutral-200">
                        <div
                          className="h-2 rounded-full bg-black transition-[width]"
                          style={{ width: `${pct}%` }}
                          aria-label={`${g.label} progresso`}
                          role="progressbar"
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={pct}
                        />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {g.current} / {g.target} {g.label.includes("Volume") ? "kg" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
              <Link
                to="/goals"
                className="mt-4 inline-block rounded-xl border px-4 py-2 text-sm font-medium hover:bg-black hover:text-white"
              >
                Ajustar metas
              </Link>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border p-5">
              <h3 className="text-lg font-semibold">Relatórios & estatísticas</h3>
              <p className="mt-1 text-sm text-neutral-700">
                Acompanhe evolução de carga, PRs e frequência semanal.
              </p>
              <Link
                to="/stats"
                className="mt-3 inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Ver estatísticas
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer simples */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-500">
          © {new Date().getFullYear()} FitTrack • <Link to="/settings" className="hover:underline">Configurações</Link>
        </div>
      </section>
    </main>
  );
}
