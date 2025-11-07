// src/routes/RequireAuth.tsx
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { me, getAuthToken } from "../lib/api";

export default function RequireAuth() {
  const [status, setStatus] = useState<"loading"|"ok"|"unauth">("loading");
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // se usa Bearer, tenta via token; se cookie, o me() resolve
        if (!getAuthToken()) {
          // ainda assim tentamos me() porque pode ser cookie httpOnly
          await me();
        } else {
          await me();
        }
        if (alive) setStatus("ok");
      } catch {
        if (!alive) return;
        setStatus("unauth");
        // redireciona pro login e guarda de onde veio
        navigate("/login", { replace: true, state: { from: loc.pathname } });
      }
    })();
    return () => { alive = false; };
  }, [loc.pathname, navigate]);

  if (status === "loading") {
    return <div className="p-6 text-sm text-neutral-500">Verificando sessão…</div>;
  }
  if (status === "unauth") return null; // já redirecionou
  return <Outlet />; // autenticado → renderiza rota filha
}
