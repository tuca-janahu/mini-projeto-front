import Input from '../../components/Input';
import Label from '../../components/Label';
import { toast } from "react-toastify";
import { login as apiLogin } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  try {
    await apiLogin({ email, password });
    toast.success("Login realizado!");
    navigate("/");
  } catch (err: Error | unknown) {
    if (err instanceof Error) {
      toast.error(err.message);
    } else {
      toast.error("Credenciais inválidas ou erro no servidor");
    }
  }
}
  return (
    <main>  
      <section className="rounded-2xl w-full max-w-2xl bg-white p-12 shadow-md mx-auto my-20">
       <div className="max-w-lg m-auto">
              <h1 className="text-3xl font-bold pt-8 ">FitTrack</h1>
        <p className="text-md text-gray-500 py-4">Seu App de registro de treinos</p>
        <h2 className="text-xl font-semibold py-4 text-center">Login</h2>
        <form className="my-6 max-w-lg m-auto" onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mt-4">
            <Label htmlFor="password">Senha</Label>
            <Input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="py-8">
            <button type="submit" className="mt-6 w-full bg-blue-600 text-white p-2 rounded cursor-pointer">Entrar</button>
          <button type="button" onClick={() => window.location.href='/register'} className="mt-6 w-full bg-white text-blue-600 border border-blue-600 p-2 rounded cursor-pointer">Cadastrar</button>
          </div>

        </form>
        </div>
      </section>
    </main>
  )
}