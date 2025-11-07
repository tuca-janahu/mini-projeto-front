import { GiWeightLiftingUp } from "react-icons/gi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import {logout} from "../lib/api";
import { toast } from "react-toastify";


function NavItem({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick?: () => void | Promise<void>;
}) {
  const navigate = useNavigate();

  return (
    <NavLink
      to={to}
      onClick={async (e) => {
        if (!onClick) return; // para outros itens do menu sem lógica extra
        e.preventDefault();   // impede navegação imediata
        try {
          await onClick();
          toast.success("Você saiu!");
        } catch {
          // opcional: toast.error("Falha ao sair");
        } finally {
          navigate(to, { replace: true });
        }
      }}
      className={({ isActive }) =>
        `px-3 py-4 text-sm font-semibold transition-all hover:bg-black/5 ${
          isActive ? "bg-black/10" : ""
        }`
      }
    >
      {label}
    </NavLink>
  );
}

export default function Header() {

  const [open, setOpen] = useState<boolean>(false);

  const location = useLocation();

  // sempre que a URL mudar, fecha o menu mobile
  useEffect(() => {
    if (open) setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-10 bg-neutral-200/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4  flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GiWeightLiftingUp />

          <h1 className="text-xl font-semibold tracking-tight">FitTrack</h1>
        </div>
        <div className="ml-auto">
          <nav className="hidden sm:flex gap-2 justify-end">
            <NavItem to="/home" label="Início" />
            <NavItem to="/training-days" label="Novo Dia" />
            <NavItem to="/exercises" label="Novo Exercício" />
            <NavItem to="/training-sessions" label="Nova Sessão" />
            <NavItem to="/" label="Sair" onClick={() => logout()} />
          </nav>

          {open ? (
          <FaXmark className="block sm:hidden" onClick={() => setOpen(!open)} />
        ) : (
          <FaBars className="block sm:hidden" onClick={() => setOpen(!open)} />
        )}

        {open && (
          <div className="absolute top-14 left-0 right-0 bg-gray-50 shadow-md">
            <nav className="flex flex-col p-4">
              <NavItem to="/home" label="Início" />
            <NavItem to="/training-days" label="Novo Dia" />
            <NavItem to="/exercises" label="Novo Exercício" />
            <NavItem to="/training-sessions" label="Nova Sessão" />
            <NavItem to="/" label="Sair" />
            </nav>
          </div>
        )}
        </div>
      </div>
    </header>
  );
}
