import { GiWeightLiftingUp } from "react-icons/gi";


export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-neutral-200/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <GiWeightLiftingUp />

          <h1 className="text-xl font-semibold tracking-tight">FitTrack</h1>
        </div>
        <div className="ml-auto w-full sm:w-96">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <span className="absolute inset-y-0 left-3 grid place-items-center">
              {/* ícone lupa */}
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                className="opacity-60"
              >
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
    </header>
  );
}
