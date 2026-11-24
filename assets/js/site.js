// Lang'Art · comportamento do site (sem dependências)
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Menu do celular
  const btn = document.querySelector(".menu-btn");
  const menu = document.getElementById("menu");
  if (btn && menu) {
    const label = btn.querySelector("span");
    const use = btn.querySelector("use");
    const set = (open) => {
      menu.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      label.textContent = open ? "Fechar" : "Menu";
      use.setAttribute("href", open ? "#i-close" : "#i-menu");
      document.body.style.overflow = open ? "hidden" : "";
    };
    btn.addEventListener("click", () => set(!menu.classList.contains("is-open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { set(false); btn.focus(); } });
  }

  // Submenu de Cursos no computador (teclado e toque)
  document.querySelectorAll(".sub-toggle").forEach((t) => {
    t.addEventListener("click", () => {
      const li = t.closest(".has-sub");
      const open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open);
      t.setAttribute("aria-expanded", String(open));
    });
  });

  // Revelação no scroll (uma vez)
  const els = document.querySelectorAll(".reveal");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -10% 0px" });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("is-in"));

  // WhatsApp flutuante recua quando o rodapé aparece
  const wa = document.querySelector(".wa-float");
  const footer = document.querySelector(".site-footer");
  if (wa && footer && "IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => wa.classList.toggle("is-hidden", en.isIntersecting)).observe(footer);
  }

  // Vídeo que roda com a rolagem
  document.querySelectorAll(".scrolly").forEach((sec) => {
    const video = sec.querySelector("video[data-scrub]");
    let target = 0, current = 0, ticking = false;
    const progress = () => {
      const r = sec.getBoundingClientRect();
      const total = sec.offsetHeight - innerHeight;
      return Math.min(1, Math.max(0, -r.top / (total || 1)));
    };
    const frame = () => {
      current += (target - current) * 0.18;
      sec.style.setProperty("--p", current.toFixed(4));
      if (video && video.duration) video.currentTime = current * (video.duration - 0.05);
      if (Math.abs(target - current) > 0.0005) requestAnimationFrame(frame); else ticking = false;
    };
    const onScroll = () => { target = progress(); if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    if (reduce) { sec.style.setProperty("--p", "0"); if (video) video.setAttribute("controls", ""); return; }
    if (video) video.addEventListener("loadedmetadata", onScroll);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    onScroll();
  });

  // Formulário (Web3Forms). Se falhar, oferece o WhatsApp.
  const form = document.querySelector("form[data-web3forms]");
  if (form) {
    const status = form.querySelector(".form-status");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      status.dataset.state = "";
      status.textContent = "Enviando…";
      try {
        const res = await fetch("https://api.web3forms.com/submit", { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        location.href = form.dataset.obrigado;
      } catch {
        status.dataset.state = "erro";
        status.innerHTML = `A mensagem não foi enviada. Tente de novo ou <a href="${form.dataset.wa}" target="_blank" rel="noopener">fale pelo WhatsApp</a>.`;
      }
    });
  }
});
