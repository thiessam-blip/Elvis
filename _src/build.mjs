// Monta o site estático da Lang'Art.
// Uso: node _src/build.mjs   (da raiz do repositório)
//
// _src/pages/*.html  -> páginas finais na raiz (index.html, metodo/index.html, ...)
// Cada página começa com um comentário JSON: {"path":"metodo/","title":"","desc":"","wa":"","nav":""}
//
// Imagens: <ph id="nome-canonico" r="4/5" w="1200" alt="texto alternativo" cls="" kind="foto|arte|video|real">
//            briefing curto de geração
//          </ph>
// Se existir assets/img/<id>.webp (ou assets/video/<id>.mp4), entra a mídia real;
// senão, entra um placeholder com nome, proporção e medida. O manifesto sai em _base/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { layout } from "./layout.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = path.join(ROOT, "_src", "pages");
export const WA_NUMBER = "5561981327556";

const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const attr = (src, name) => (src.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];

const manifest = new Map();

function renderPh(attrs, body, ctx) {
  const id = attr(attrs, "id");
  const r = attr(attrs, "r") || "4/5";
  const w = Number(attr(attrs, "w") || 1200);
  const alt = attr(attrs, "alt") || "";
  const cls = attr(attrs, "cls") || "";
  const kind = attr(attrs, "kind") || "foto";
  const [rw, rh] = r.split("/").map(Number);
  const h = Math.round((w * rh) / rw);
  const brief = body.trim().replace(/\s+/g, " ");

  const entry = manifest.get(id) || { id, r, w, h, kind, alt, brief, pages: [] };
  if (!entry.pages.includes(ctx.path)) entry.pages.push(ctx.path);
  if (brief && !entry.brief) entry.brief = brief;
  manifest.set(id, entry);

  const style = `aspect-ratio:${rw}/${rh}`;
  if (kind === "video") {
    const file = path.join(ROOT, "assets", "video", `${id}.mp4`);
    const poster = fs.existsSync(path.join(ROOT, "assets", "img", `${id}-poster.webp`))
      ? ` poster="${ctx.root}assets/img/${id}-poster.webp"` : "";
    if (fs.existsSync(file)) {
      return `<video class="media ${cls}" muted playsinline preload="auto"${poster} aria-label="${esc(alt)}" data-scrub src="${ctx.root}assets/video/${id}.mp4"></video>`;
    }
  } else {
    const file = path.join(ROOT, "assets", "img", `${id}.webp`);
    if (fs.existsSync(file)) {
      const lazy = cls.includes("eager") ? `fetchpriority="high"` : `loading="lazy" decoding="async"`;
      return `<img class="media ${cls}" src="${ctx.root}assets/img/${id}.webp" alt="${esc(alt)}" width="${w}" height="${h}" ${lazy} style="${style}">`;
    }
  }
  const tag = { foto: "foto a gerar", arte: "arte a gerar", video: "vídeo a gerar", real: "foto real · pedir à escola" }[kind] || kind;
  return `<div class="ph ph--${kind} ${cls}" role="img" aria-label="${esc(alt)}" style="${style}" data-img="${id}">` +
    `<span class="ph__tag">${tag}</span><span class="ph__id">${id}</span><span class="ph__size">${r.replace("/", ":")} · ${w}×${h}</span></div>`;
}

function build() {
  const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".html"));
  for (const f of files) {
    const src = fs.readFileSync(path.join(PAGES, f), "utf8");
    const m = src.match(/^<!--\s*(\{[\s\S]*?\})\s*-->/);
    if (!m) throw new Error(`${f}: falta o cabeçalho JSON`);
    const meta = JSON.parse(m[1]);
    let body = src.slice(m[0].length);
    const outRel = meta.path.endsWith(".html") ? meta.path : path.join(meta.path, "index.html");
    const depth = meta.path === "" || meta.path.endsWith(".html") ? meta.path.split("/").length - 1 : meta.path.split("/").filter(Boolean).length;
    const root = meta.root || (depth ? "../".repeat(depth) : "./");
    const ctx = { path: "/" + meta.path, root };

    body = body.replace(/<ph\b([^>]*)>([\s\S]*?)<\/ph>/g, (_, a, b) => renderPh(a, b, ctx));
    const html = layout({ ...meta, body, root, wa: esc(waLink(meta.wa || "Olá! Vim pelo site e quero consultar horários e valores.")) })
      .replace(/\{\{wa:([^}]+)\}\}/g, (_, msg) => esc(waLink(msg.trim())))
      .replace(/\{\{wa\}\}/g, esc(waLink(meta.wa || "Olá! Vim pelo site e quero consultar horários e valores.")))
      .replace(/\{\{root\}\}/g, root);

    const out = path.join(ROOT, outRel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    console.log("ok", outRel);
  }
  writeManifest();
}

function writeManifest() {
  const base = path.join(ROOT, "_base");
  fs.mkdirSync(base, { recursive: true });
  const list = [...manifest.values()].sort((a, b) => a.kind.localeCompare(b.kind) || a.id.localeCompare(b.id));
  fs.writeFileSync(path.join(base, "imagens-manifesto.json"), JSON.stringify(list, null, 2));
  const status = (e) => {
    const p = e.kind === "video" ? path.join(ROOT, "assets", "video", `${e.id}.mp4`) : path.join(ROOT, "assets", "img", `${e.id}.webp`);
    return fs.existsSync(p) ? "pronta" : "falta";
  };
  const rows = list.map((e) => `| \`${e.id}\` | ${e.kind} | ${e.r.replace("/", ":")} | ${e.w}×${e.h} | ${status(e)} | ${e.pages.join(", ")} | ${e.brief || e.alt} |`);
  fs.writeFileSync(path.join(base, "06-imagens-manifesto.md"),
    `# Manifesto de imagens do site (gerado pelo build, não editar à mão)\n\n` +
    `Arquivo final: \`assets/img/<id>.webp\` (vídeo: \`assets/video/<id>.mp4\` + \`assets/img/<id>-poster.webp\`).\n` +
    `Medida = largura de exportação (2× a maior exibição). Regras de imagem em \`05-direcao-de-imagem.md\`.\n\n` +
    `| id | tipo | proporção | medida | status | páginas | briefing |\n|---|---|---|---|---|---|---|\n${rows.join("\n")}\n`);
  console.log(`manifesto: ${list.length} itens (${list.filter((e) => status(e) === "falta").length} faltando)`);
}

build();
