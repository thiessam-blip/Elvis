# Lang'Art · site institucional (fase 1)

Site estático (HTML, CSS e JavaScript, sem dependências) da Lang'Art, escola de francês por meio da arte no Lago Sul, Brasília.

## Estrutura

```
_src/pages/   uma página por arquivo, só o conteúdo (cabeçalho JSON no topo)
_src/layout.mjs   menu, rodapé, WhatsApp flutuante e ícones, comuns a todas as páginas
_src/build.mjs    monta as páginas finais na raiz
assets/css, assets/js, assets/svg, assets/img, assets/video
index.html, metodo/, cursos/, ...   páginas geradas (é isto que vai para a hospedagem)
```

## Como atualizar

1. Edite a página em `_src/pages/`.
2. Rode `node _src/build.mjs` na raiz do repositório.
3. Para ver localmente: `python -m http.server 8765` e abra `http://127.0.0.1:8765/`. Não abra o `index.html` com dois cliques: sem servidor, os links do menu abrem a pasta em vez da página.

## Imagens

Cada imagem tem um nome fixo (ex.: `foto-criancas-maos-pintando`). Enquanto o arquivo não existe, o build mostra um
espaço reservado com o nome e a medida. Ao salvar `assets/img/<nome>.webp` (ou `assets/video/<nome>.mp4`) e rodar o
build de novo, a imagem entra sozinha.

## Antes de publicar

- **No GitHub (online) segue a página "site em construção" (desde 2026-11-24).** Localmente o home já voltou para a raiz (`index.html`) e os commits de acabamento ficam só na máquina, sem push (trava em `.git/hooks/pre-push`). A página provisória está guardada em `_src/em-construcao.html`. Para lançar: apagar a trava (`.git/hooks/pre-push`) e fazer o push.

- Tirar `noindex` do `_src/layout.mjs`.
- Trocar `WEB3FORMS_ACCESS_KEY` em `_src/pages/contato.html`.
- Liberar o domínio no kit do Adobe Fonts.
- Resolver os trechos marcados em vermelho tracejado (informações a confirmar).
