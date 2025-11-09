import Input from "../components/Input"
import Label from "../components/Label"
import { useState } from "react";
import { register as apiRegister } from "../lib/api"; // seu api.ts
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRegister({ name: name || undefined, email, password });
      toast.success("Conta criada com sucesso! Faça seu Login.");
      navigate("/login"); // o toast continua visível após o redirect
      
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
         toast.error(err?.message ?? "Falha ao registrar");
      } else {
        toast.error("Falha ao registrar");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>  
      <section className="md:rounded-xl w-full max-w-2xl h-100vh bg-white p-6 md:p-12 md:shadow-md mx-auto md:my-20">
            <div className="max-w-lg m-auto">
              <h1 className="text-3xl font-bold pt-8 ">FitTrack</h1>
        <p className="text-md text-gray-500 py-4">Seu App de registro de treinos</p>
              
        <h2 className="text-xl font-semibold py-4 text-center">Cadastre-se</h2>
        <form className="my-6" onSubmit={onSubmit}>
            <div>
            <Label htmlFor="name">Nome</Label>
            <Input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mt-4">
            <Label htmlFor="password">Senha</Label>
            <Input type="password" id="password" required value={password}
                 onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="py-8">
            <button type="submit" disabled={loading || !email || !password} className="mt-6 w-full bg-blue-600 text-white p-2 rounded cursor-pointer">
             {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

           
          </div>

        </form>
        </div>
      </section>
    </main>
  )
}