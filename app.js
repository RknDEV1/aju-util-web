const items = [
  {id:"samu", title:"SAMU", cat:"emergency", summary:"Urgência e emergência médica", phone:"192", tags:["emergência","saúde"]},
  {id:"bombeiros", title:"Bombeiros", cat:"emergency", summary:"Incêndio e salvamento", phone:"193", tags:["emergência"]},
  {id:"pm", title:"Polícia Militar", cat:"emergency", summary:"Ocorrências policiais", phone:"190", tags:["emergência"]},
  {id:"defesa", title:"Defesa Civil", cat:"emergency", summary:"Desastres e risco", phone:"199", tags:["emergência"]},
  {id:"cvv", title:"CVV", cat:"health", summary:"Apoio emocional 24h", phone:"188", tags:["saúde mental"]},
  {id:"central-saude", title:"Central da Saúde", cat:"health", summary:"0800 rede municipal", phone:"08007293534", tags:["saúde","SUS"]},
  {id:"procon", title:"Procon Aracaju", cat:"government", summary:"Defesa do consumidor", phone:"151", tags:["procon"]},
  {id:"emsurb", title:"EMSURB", cat:"government", summary:"Limpeza urbana", phone:"08002841300", tags:["lixo"]},
  {id:"prefeitura", title:"Prefeitura de Aracaju", cat:"government", summary:"Portal oficial", url:"https://www.aracaju.se.gov.br", tags:["prefeitura"]},
  {id:"ufs", title:"UFS", cat:"education", summary:"Universidade Federal de Sergipe", url:"https://www.ufs.br", tags:["universidade"]},
  {id:"orla", title:"Orla de Atalaia", cat:"city", summary:"Principal orla de lazer", tags:["orla","praia"]},
  {id:"caju-hub", title:"Caju Hub", cat:"tech", summary:"Hub de inovação e capacitação", tags:["tech","hub"]},
  {id:"gdg", title:"GDG Aracaju", cat:"tech", summary:"Comunidade de desenvolvedores", url:"https://gdg.community.dev/gdg-aracaju/", tags:["dev"]},
  {id:"sebrae", title:"Sebrae SE", cat:"tech", summary:"Apoio a MEI e pequenos negócios", url:"https://www.sebrae.com.br/sites/PortalSebrae/ufs/se", tags:["mei"]}
];

const categories = {
  emergency: "Emergência",
  government: "Serviços públicos",
  health: "Saúde",
  education: "Educação",
  city: "Cidade e orla",
  tech: "Tech e inovação"
};

let favorites = JSON.parse(localStorage.getItem("aju-fav") || "[]");
let currentView = "home";

function saveFav() {
  localStorage.setItem("aju-fav", JSON.stringify(favorites));
}

function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.push(id);
  }
  saveFav();
  render();
}

function call(phone) {
  window.location.href = "tel:" + phone;
}

function filterItems() {
  render();
}

function showView(view) {
  currentView = view;
  document.querySelectorAll("nav a").forEach(a => a.classList.remove("active"));
  document.getElementById("nav-" + view)?.classList.add("active");
  render();
}

function render() {
  const q = document.getElementById("search").value.toLowerCase().trim();
  const content = document.getElementById("content");
  const chips = document.getElementById("emergency-chips");

  // Emergency chips
  chips.innerHTML = items
    .filter(i => i.cat === "emergency" && ["190","192","193","199"].includes(i.phone))
    .map(i => `<a class="chip" href="tel:${i.phone}">${i.phone} ${i.title}</a>`)
    .join("");

  let html = "";

  if (currentView === "home") {
    const filtered = items.filter(i =>
      !q || i.title.toLowerCase().includes(q) || i.summary.toLowerCase().includes(q) || i.tags.some(t => t.includes(q))
    );

    Object.keys(categories).forEach(cat => {
      const list = filtered.filter(i => i.cat === cat);
      if (list.length === 0) return;
      html += `<div class="section"><h2>${categories[cat]}</h2>`;
      list.forEach(item => {
        html += renderCard(item);
      });
      html += `</div>`;
    });
  } else if (currentView === "emergency") {
    html = `<div class="section"><h2>Emergência</h2>`;
    items.filter(i => i.cat === "emergency").forEach(item => {
      html += renderCard(item);
    });
    html += `</div>`;
  } else if (currentView === "favorites") {
    const favItems = items.filter(i => favorites.includes(i.id));
    html = `<div class="section"><h2>Favoritos</h2>`;
    if (favItems.length === 0) {
      html += `<p style="color:var(--muted)">Nenhum favorito ainda. Toque na estrela nos cards.</p>`;
    } else {
      favItems.forEach(item => html += renderCard(item));
    }
    html += `</div>`;
  } else if (currentView === "tips") {
    html = `
      <div class="section">
        <h2>Dicas de saúde</h2>
        <div class="card"><h3>Quando ligar 192</h3><p>Dor no peito, falta de ar, desmaio, trauma grave ou risco à vida. Não use para consulta de rotina.</p></div>
        <div class="card"><h3>CVV 188</h3><p>Apoio emocional gratuito 24h. Em crise com risco, combine com SAMU/PM.</p></div>
        <div class="card"><h3>Informação oficial</h3><p>Confirme sempre telefones e horários nos canais da Prefeitura. Este app não substitui serviços oficiais.</p></div>
      </div>
    `;
  }

  content.innerHTML = html || `<div class="section"><p style="color:var(--muted)">Nada encontrado.</p></div>`;
}

function renderCard(item) {
  const isFav = favorites.includes(item.id);
  const phoneHtml = item.phone ? `<a class="phone" href="tel:${item.phone}">${item.phone}</a>` : "";
  const urlHtml = item.url ? `<br><a href="${item.url}" target="_blank" style="color:var(--accent)">Abrir site</a>` : "";
  return `
    <div class="card">
      <h3>${item.title} <span style="float:right;cursor:pointer" onclick="toggleFav('${item.id}')">${isFav ? "★" : "☆"}</span></h3>
      <p>${item.summary}</p>
      ${phoneHtml}${urlHtml}
    </div>
  `;
}

// Initial render
render();

// Register service worker for basic offline (optional)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
