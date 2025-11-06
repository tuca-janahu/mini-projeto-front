export default function Footer() {
  return (
    <footer className="bg-neutral-200 mt-8 py-8">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-neutral-800 ">
        © {new Date().getFullYear()} Desenvolvido por 
        <a href="https://github.com/tuca-janahu" target="_blank" rel="noopener noreferrer" className="hover:underline"> Artur Janahú </a>
       
      </div>
    </footer>
  );
}
