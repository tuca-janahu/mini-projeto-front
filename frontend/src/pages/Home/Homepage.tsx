import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function Home() {
  // MOCK: dados de exemplo (substitua depois por dados reais da API)
  const today = new Date().toLocaleDateString();
  const quickActions = [
    { label: "Novo exercício", to: "/exercises" },
    { label: "Novo dia de treino", to: "/training-days" },
    { label: "Nova sessão", to: "/training-sessions" },
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


  return (
    <main className="w-full max-w-100vw max-h-100vh bg-white m-auto">
      <Header />

      <section className="mx-auto max-w-7xl px-4 py-6">
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
                        
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">{s.date}</p>
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

          
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
