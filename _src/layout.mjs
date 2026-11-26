// Moldura comum de todas as páginas: <head>, menu, rodapé, WhatsApp flutuante e ícones.
// {{root}} vira o caminho relativo até a raiz do site (o build substitui).

const icons = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
<symbol id="i-out" viewBox="0 0 24 24"><path d="M14 5h5v5m0-5-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></symbol>
</svg>`;

const nav = [
  { key: "metodo", href: "metodo/", label: "O método" },
  { key: "cursos", href: "cursos/", label: "Cursos", sub: [
    { href: "cursos/criancas/", label: "Para crianças", note: "a partir de 3 anos" },
    { href: "cursos/jovens/", label: "Para jovens", note: "faixa a confirmar" },
    { href: "cursos/adultos/", label: "Para adultos", note: "" },
    { href: "cursos/", label: "Ver todos os cursos", note: "" },
  ] },
  { key: "ferias", href: "ferias-e-intensivos/", label: "Férias e intensivos" },
  { key: "langart", href: "a-langart/", label: "A Lang'Art" },
  { key: "contato", href: "contato/", label: "Contato" },
];

const navItem = (n, cur) => {
  const current = n.key === cur ? ' aria-current="page"' : "";
  if (!n.sub) return `<li><a href="{{root}}${n.href}"${current}>${n.label}</a></li>`;
  const sub = n.sub.map((s) => `<li><a href="{{root}}${s.href}">${s.label}${s.note ? `<small>${s.note}</small>` : ""}</a></li>`).join("");
  return `<li class="has-sub"><a href="{{root}}${n.href}"${current}>${n.label}</a>` +
    `<button class="sub-toggle" aria-expanded="false" aria-label="Abrir as idades de Cursos"><svg class="i"><use href="#i-down"/></svg></button>` +
    `<ul class="sub">${sub}</ul></li>`;
};

export function layout({ title, desc, body, wa, nav: cur, bodyClass = "", noindex }) {
  const fullTitle = title ? `${title} · Lang'Art, francês e arte no Lago Sul` : "Lang'Art · Francês por meio da arte no Lago Sul, Brasília";
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${fullTitle}</title>
<meta name="description" content="${desc || ""}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#E8E5DD">
<link rel="icon" href="{{root}}assets/svg/logo/monograma-LA-fundo-azul-estrela-vermelha.svg" type="image/svg+xml">
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="stylesheet" href="https://use.typekit.net/cvd0qmz.css">
<link rel="stylesheet" href="{{root}}assets/css/site.css?v=4">
<script src="{{root}}assets/js/site.js?v=3" defer></script>
</head>
<body class="${bodyClass}">
${icons}
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="logo" href="{{root}}" aria-label="Lang'Art, página inicial"><img src="{{root}}assets/svg/logo/logo-simples-vermelho.svg?v=3" alt="Lang'Art" width="196" height="72"></a>
    <button class="menu-btn" aria-expanded="false" aria-controls="menu"><svg class="i"><use href="#i-menu"/></svg><span>Menu</span></button>
    <nav id="menu" class="menu" aria-label="Principal">
      <ul>${nav.map((n) => navItem(n, cur)).join("")}</ul>
      <a class="btn btn--primary btn--sm" href="${wa}" target="_blank" rel="noopener">Consulte horários e valores</a>
    </nav>
  </div>
</header>
<main id="conteudo">
${body}
</main>
<footer class="site-footer on-dark">
  <img class="footer-flor" src="{{root}}assets/svg/ornamentos/flor-contorno-vermelho.svg" alt="" aria-hidden="true">
  <div class="wrap footer-grid">
    <div class="footer-about">
      <img src="{{root}}assets/svg/logo/logo-simples-creme.svg?v=3" class="footer-logo" alt="Lang'Art" width="230" height="84">
      <p>Escola de francês por meio da arte, no Lago Sul. Aula individual ou turma de até 4 alunos, e aula individual on-line.</p>
      <img class="footer-selo" src="{{root}}assets/svg/passaros/selo-passaro-oval-azulclaro.svg" alt="" aria-hidden="true" width="120" height="108">
    </div>
    <nav aria-label="Rodapé">
      <ul class="footer-links">
        <li><a href="{{root}}metodo/">O método</a></li>
        <li><a href="{{root}}cursos/">Cursos</a></li>
        <li><a href="{{root}}cursos/criancas/">Para crianças</a></li>
        <li><a href="{{root}}cursos/jovens/">Para jovens</a></li>
        <li><a href="{{root}}cursos/adultos/">Para adultos</a></li>
        <li><a href="{{root}}ferias-e-intensivos/">Férias e intensivos</a></li>
        <li><a href="{{root}}a-langart/">A Lang'Art</a></li>
        <li><a href="{{root}}perguntas-frequentes/">Perguntas frequentes</a></li>
        <li><a href="{{root}}contato/">Contato</a></li>
      </ul>
    </nav>
    <div class="footer-contact">
      <p><a href="${wa}" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> WhatsApp (61) 98132-7556</a></p>
      <p>Telefone <span class="tbc">(61) 3554-[a confirmar]</span></p>
      <p><a href="https://www.instagram.com/langart.ap/" target="_blank" rel="noopener">Instagram @langart.ap</a></p>
      <p>QI 21, Lago Sul, Brasília · <a href="https://www.google.com/maps/search/?api=1&amp;query=Lang%27Art+QI+21+Lago+Sul+Bras%C3%ADlia" target="_blank" rel="noopener">Ver no mapa</a></p>
      <p>Atendimento <span class="tbc">[horário a confirmar]</span></p>
      <p><a href="{{root}}contato/#formulario">Prefere escrever? Use o formulário</a></p>
      <p class="footer-atelier">Também no atelier: Atelier de Artes, aos sábados. <a href="{{wa:Olá! Vim pelo site e quero saber do Atelier de Artes aos sábados.}}" target="_blank" rel="noopener">Falar sobre o Atelier de Artes</a></p>
    </div>
  </div>
  <div class="wrap footer-legal"><a href="{{root}}privacidade/">Política de privacidade</a><span>© Lang'Art</span></div>
</footer>
<a class="wa-float" href="${wa}" target="_blank" rel="noopener" aria-label="Conversar no WhatsApp"><svg class="i"><use href="#i-wa"/></svg><span>WhatsApp</span></a>
</body>
</html>
`;
}
