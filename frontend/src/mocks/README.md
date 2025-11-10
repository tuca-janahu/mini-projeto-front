# Mocks (MSW) — o que são e como usar

Este diretório contém mocks usados em desenvolvimento para simular as respostas da API sem precisar de um backend real. Os mocks são implementados com MSW (Mock Service Worker) e facilitam o desenvolvimento e testes locais.

Arquivos relevantes:

- `handlers.ts` — define rotas, dados de exemplo e o comportamento das respostas (ex.: `GET /exercises`, `POST /auth/login`).
- `public/mockServiceWorker.js` — o service worker gerado pelo MSW (já incluído no projeto para uso em navegador).

Como os mocks funcionam (resumo técnico):

- Em runtime, o service worker intercepta requisições HTTP/fetch feitas pelo aplicativo e responde com as definições presentes em `handlers.ts`.
- Normalmente você registra e inicializa o worker apenas em ambiente de desenvolvimento.

Como ativar os mocks

1. Defina a variável de ambiente `VITE_USE_MOCKS` como `true` para habilitar os mocks em dev. Exemplo (PowerShell, sessão atual):

```bash
$env:VITE_USE_MOCKS = 'true'
npm run dev
```

Ou crie um arquivo `.env.local` na raiz do projeto com:

```bash
VITE_USE_MOCKS=true
```

2. Adicione (ou verifique) este trecho em `src/main.tsx` (ou onde a aplicação é inicializada) para importar e iniciar o worker condicionalmente:

```ts
// Exemplo mínimo: importa o worker só em DEV e quando VITE_USE_MOCKS=true
if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCKS === 'true') {
	// import dinâmica evita carregar o msw em produção
	import('./mocks/browser').then(({ worker }) => {
		worker.start();
	});
}

```

Como desativar os mocks

- Remova ou defina `VITE_USE_MOCKS=false` (ou remova a variável do `.env`).

```bash
$env:VITE_USE_MOCKS = 'false'
npm run dev
```

- Outra forma é comentar/remover o bloco que importa/inicia o worker em `src/main.tsx`.

Observações e problemas comuns

- Depois de alterar se o worker está ativo/desativado, pode ser necessário limpar o cache do service worker no navegador (DevTools → Application → Service Workers → Unregister) para evitar respostas antigas.
- Nunca habilite os mocks em produção; use apenas em desenvolvimento/ambientes de teste.

## Resumidamente...

- Habilitar (via `.env`): `VITE_USE_MOCKS=true` → iniciar `npm run dev`.
- Desabilitar: remover a variável ou garantir `VITE_USE_MOCKS=false`.
