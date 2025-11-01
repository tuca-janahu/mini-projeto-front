import Input from '../../components/Input';

export default function Login() {
  return (
    <main>  
      <section className="rounded-2xl w-full max-w-2xl bg-white p-12 shadow-md m-auto mt-20">
        <h1 className="text-3xl font-bold pt-8 text-center">App de Registro de Treinos</h1>
        <h2 className="text-xl font-semibold py-4 text-center">Login</h2>
        <form className="my-6 max-w-lg m-auto">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <Input type="email" id="email" required />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
            <Input type="password" id="password" required />
          </div>
          <div className="py-8">
            <button type="submit" className="mt-6 w-full bg-blue-600 text-white p-2 rounded cursor-pointer">Entrar</button>
          <button type="button" onClick={() => window.location.href='/register'} className="mt-6 w-full bg-white text-blue-600 border border-blue-600 p-2 rounded cursor-pointer">Cadastrar</button>
          </div>

        </form>
      </section>
    </main>
  )
}