// bio ng lahat interchangable naman
const BIO = "hatdogs";
// repo links naten
const members = [
  {name:"Jerald Interno",      bio:BIO, repo:"JeraldSanInterno/CPE232_Jerald_Interno",       photo:"photos/jerald.jpg"},
  {name:"Melquisedec Iquin",   bio:BIO, repo:"MelquisedecIquin/CPE212_Iquin",                photo:"photos/melquisedec.jpg"},
  {name:"Kathlyn Javillonar",  bio:BIO, repo:"MadhelKathlynAnnJavillonar/CPE212_Javillonar", photo:"photos/kathlyn.jpg"},
  {name:"Aicon Keliste",       bio:BIO, repo:"AiconKeliste/CPE212_KELISTE",                  photo:"photos/aicon.png"}
];

const $ = s => document.querySelector(s);
const icon = id => `<svg><use href="#${id}"/></svg>`;
const avatar = m => m.photo
  ? `<div class="avatar"><img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover"></div>`
  : `<div class="avatar"><svg viewBox="0 0 80 80"><use href="#photo"/></svg></div>`;
const terms = () => `<div class="term">&gt;_<span></span></div><div class="term">&gt;_<span></span></div>`;

$("#enter").onclick = () => { $("#splash").hidden = true; $("#app").hidden = false; show("overview"); };

function show(tab){
  closeProfile();
  $("#overview").hidden = tab !== "overview";
  $("#portfolios").hidden = tab !== "portfolios";
  $("#tab-overview").setAttribute("aria-selected", tab === "overview");
  $("#tab-portfolios").setAttribute("aria-selected", tab === "portfolios");
}
$("#tab-overview").onclick = () => show("overview");
$("#tab-portfolios").onclick = () => show("portfolios");

function renderCards(){
  $("#cards").innerHTML = members.map((m,i) => `
    <div class="card">
      ${avatar(m)}
      <h2 class="name">${m.name}</h2>
      <p class="bio">${m.bio}</p>
      ${terms()}
      <button class="pill" data-i="${i}">Full Profile</button>
    </div>`).join("");
  $("#cards").querySelectorAll(".pill").forEach(b => b.onclick = () => openProfile(+b.dataset.i));
}

function openProfile(i){
  const m = members[i];
  $("#cards").hidden = true;
  const p = $("#profile");
  p.hidden = false;
  p.innerHTML = `
    <div class="side">
      ${avatar(m)}
      <h2 class="name" id="p-name">${m.name}</h2>
      <p class="bio" id="p-bio">${m.bio}</p>
      ${terms()}
    </div>
    <div class="tree">
      <div class="row root">${icon("folder")}PORTFOLIO'S</div>
      <div id="tree-body" class="branch"></div>
      <div class="actions">
        <button class="edit" id="reload">${icon("refresh")}Reload</button>
        <button class="edit" id="edit">${icon("pen")}Edit Profile</button>
        <button class="close" id="close">Close</button>
      </div>
    </div>`;
  p.querySelectorAll(".actions svg").forEach(s => { s.style.cssText = "width:16px;height:16px;fill:currentColor"; });
  loadTree(m.repo, "", $("#tree-body"));
  $("#close").onclick = closeProfile;
  $("#edit").onclick = () => toggleEdit(i);
  $("#reload").onclick = () => reloadTree(m.repo);
  p.scrollIntoView({behavior:"smooth", block:"start"});
}

const esc = t => String(t).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let freshUntil = 0; 

async function fetchDir(repo, path){
  const key = "gh:" + repo + ":" + path;
  try { const hit = sessionStorage.getItem(key); if (hit) return JSON.parse(hit); } catch(e){}
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`,
                          {headers:{Accept:"application/vnd.github+json"},
                           cache: Date.now() < freshUntil ? "no-cache" : "default"});
  if (res.status === 404) throw new Error("Repo or folder not found. Check the repo name and that it is public.");
  if (res.status === 403) throw new Error("GitHub rate limit reached. Try again in a few minutes.");
  if (!res.ok) throw new Error("Could not load files from GitHub.");
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch(e){}
  return data;
}

function reloadTree(repo){
  Object.keys(sessionStorage)
    .filter(k => k.startsWith("gh:" + repo + ":") || k.startsWith("gh2:" + repo + ":"))
    .forEach(k => sessionStorage.removeItem(k));
  freshUntil = Date.now() + 60000;
  loadTree(repo, "", $("#tree-body"));
}

async function loadTree(repo, path, mount){
  mount.innerHTML = '<p class="status">Loading from GitHub…</p>';
  try {
    const items = (await fetchDir(repo, path)).sort((x,y) => (x.type === "dir" ? 0 : 1) - (y.type === "dir" ? 0 : 1) || x.name.localeCompare(y.name));
    if (!items.length){ mount.innerHTML = '<p class="status">This folder is empty.</p>'; return; }
    const ul = document.createElement("ul");
    items.forEach(it => {
      const li = document.createElement("li");
      if (it.type === "dir"){
        li.innerHTML = `<button class="row" aria-expanded="false">${icon("folder")}${esc(it.name)}</button><div class="branch" hidden></div>`;
        const btn = li.firstChild, box = li.lastChild;
        btn.onclick = () => {
          const open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", !open);
          box.hidden = open;
          if (!open && !box.dataset.loaded){ box.dataset.loaded = 1; loadTree(repo, it.path, box); }
        };
      } else {
        li.innerHTML = `<a class="row file" href="${esc(it.html_url)}" target="_blank" rel="noopener">${icon("file")}${esc(it.name)}</a>`;
      }
      ul.appendChild(li);
    });
    mount.replaceChildren(ul);
  } catch(err){
    mount.innerHTML = `<p class="status err">${esc(err.message)}</p>`;
  }
}

function toggleEdit(i){
  const els = [$("#p-name"), $("#p-bio")];
  const editing = els[0].isContentEditable;
  if (editing){
    members[i].name = els[0].textContent.trim() || members[i].name;
    members[i].bio  = els[1].textContent.trim() || members[i].bio;
    els.forEach(e => e.contentEditable = false);
    $("#edit").lastChild.textContent = "Edit Profile";
    renderCards();
  } else {
    els.forEach(e => e.contentEditable = true);
    els[0].focus();
    $("#edit").lastChild.textContent = "Save Profile";
  }
}

function closeProfile(){
  $("#profile").hidden = true;
  $("#cards").hidden = false;
}

renderCards();
