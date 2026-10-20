// Bio text
const BIO = "Group 5";

// Team member information
const members = [
  {
    name: "Jerald Interno",
    bio: BIO,
    email: "qjsminterno@tip.edu.ph",
    githubUrl: "https://github.com/JeraldSanInterno",
    repo: "JeraldSanInterno/CPE232_Jerald_Interno",
    photo: "photos/jerald.jpg"
  },
  {
    name: "Melquisedec Iquin",
    bio: BIO,
    email: "qmdiquin@tip.edu.ph",
    githubUrl: "https://github.com/MelquisedecIquin",
    repo: "MelquisedecIquin/CPE212_Iquin",
    photo: "photos/mel.png"
  },
  {
    name: "Kathlyn Javillonar",
    bio: BIO,
    email: "qmkaajavillonar@tip.edu.ph",
    githubUrl: "https://github.com/MadhelKathlynAnnJavillonar",
    repo: "MadhelKathlynAnnJavillonar/CPE212_Javillonar",
    photo: "photos/kath.jpg"
  },
  {
    name: "Aicon Keliste",
    bio: BIO,
    email: "qahkeliste@tip.edu.ph",
    githubUrl: "https://github.com/AiconKeliste",
    repo: "AiconKeliste/CPE212_KELISTE",
    photo: "photos/aicon.jpeg"
  }
];

const $ = s => document.querySelector(s);
const icon = id => `<svg><use href="#${id}"/></svg>`;
const avatar = m => m.photo
  ? `<div class="avatar"><img src="${m.photo}" alt="${m.name}" style="width:100%;height:100%;object-fit:cover"></div>`
  : `<div class="avatar"><svg viewBox="0 0 80 80"><use href="#photo"/></svg></div>`;

// Terminal Action Links (>_)
const terms = m => `
  <div class="term-container">
    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(m.email)}" target="_blank" rel="noopener" class="term-box" title="Send Email via Gmail to ${m.email}">
      <span class="prompt-icon">&gt;_</span>
      <span class="label">EMAIL</span>
    </a>
    <a href="${m.githubUrl}" target="_blank" rel="noopener" class="term-box" title="Open GitHub Profile">
      <span class="prompt-icon">&gt;_</span>
      <span class="label">GITHUB</span>
    </a>
  </div>`;

// Base GitHub Repository URL for your project
const REPO_BASE = "https://github.com/AiconKeliste/CPE212_CPE31S2_FINAL_PROJECT";

// Pipeline Stage Interactive Modal Logic
function openPipelineModal(stage) {
  const modal = $("#pipeline-modal");
  const titleText = $("#modal-title-text span");
  const iconUse = $("#modal-icon use");
  const body = $("#modal-body-content");

  if (!modal || !body) return;

  if (stage === 'code') {
    titleText.textContent = "CODE STAGE";
    iconUse.setAttribute("href", "#code");
    body.innerHTML = `
      <p>Select a source file below to view its code directly on GitHub:</p>
      <div class="modal-choices">
        <a href="${REPO_BASE}/blob/main/docker.html" target="_blank" rel="noopener" class="modal-choice-btn">
          <span>📄 View docker.html</span>
          <span class="tag">HTML / UI</span>
        </a>
        <a href="${REPO_BASE}/blob/main/docker.js" target="_blank" rel="noopener" class="modal-choice-btn">
          <span>⚡ View docker.js</span>
          <span class="tag">JavaScript</span>
        </a>
      </div>`;
  }
  else if (stage === 'build') {
    titleText.textContent = "BUILD STAGE";
    iconUse.setAttribute("href", "#gear");
    body.innerHTML = `
      <p>Building the web assets into a lightweight Docker image using Nginx runtime.</p>
      <div class="modal-code-block"># Build Docker Image Command
$ docker build -t portfolio-web:1.0 .

[+] Building 1.2s (7/7) FINISHED
 => exporting to image
 => naming to docker.io/library/portfolio-web:1.0</div>
      <div class="modal-choices" style="margin-top:16px;">
        <a href="${REPO_BASE}" target="_blank" rel="noopener" class="modal-choice-btn">
          <span>🔗 Open Repository on GitHub</span>
          <span class="tag">Build Config</span>
        </a>
      </div>`;
  }
  else if (stage === 'package') {
    titleText.textContent = "PACKAGE STAGE";
    iconUse.setAttribute("href", "#box");
    body.innerHTML = `
      <p>Packaging application automation tasks into an Ansible Playbook configuration (<code>docker_image.yml</code>).</p>
      <div class="modal-code-block"># Ansible Image Packaging Task
- name: Package Docker Portfolio Service
  community.docker.docker_image:
    name: portfolio-web
    tag: "1.0"
    source: build
    build:
      path: ./</div>
      <div class="modal-choices" style="margin-top:16px;">
        <a href="${REPO_BASE}/blob/main/docker_image.yml" target="_blank" rel="noopener" class="modal-choice-btn">
          <span>📦 View docker_image.yml on GitHub</span>
          <span class="tag">Ansible Playbook</span>
        </a>
      </div>`;
  }
  else if (stage === 'deploy') {
    titleText.textContent = "DEPLOY STAGE";
    iconUse.setAttribute("href", "#cloud");
    body.innerHTML = `
      <p>Executing continuous availability deployment on target VM nodes via Ansible, mapping port 80 and applying restart policies.</p>
      <div class="modal-code-block"># Terminal Execution Command on Target Node
$ ansible-playbook -i hosts docker_image.yml

TASK [Run Docker Container] *********************
changed: [192.168.56.103] -> Port 80:80 [RUNNING]
Restart Policy: always</div>
      <div class="modal-choices" style="margin-top:16px;">
        <a href="${REPO_BASE}/blob/main/docker_image.yml" target="_blank" rel="noopener" class="modal-choice-btn">
          <span>🚀 View Deployment Playbook on GitHub</span>
          <span class="tag">VM Target</span>
        </a>
      </div>`;
  }

  modal.hidden = false;
}

function closePipelineModal() {
  const modal = $("#pipeline-modal");
  if (modal) modal.hidden = true;
}

// Close modal when clicking outside box
window.onclick = function (event) {
  const modal = $("#pipeline-modal");
  if (event.target === modal) {
    modal.hidden = true;
  }
};

// Navigation Tab Switcher
function show(tab) {
  closeProfile();
  if ($("#overview")) $("#overview").hidden = (tab !== "overview");
  if ($("#portfolios")) $("#portfolios").hidden = (tab !== "portfolios");
  if ($("#tab-overview")) $("#tab-overview").setAttribute("aria-selected", tab === "overview");
  if ($("#tab-portfolios")) $("#tab-portfolios").setAttribute("aria-selected", tab === "portfolios");
}

// Render Portfolio Cards Grid
function renderCards() {
  const cardsContainer = $("#cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = members.map((m, i) => `
    <div class="card">
      ${avatar(m)}
      <h2 class="name">${m.name}</h2>
      <p class="bio">${m.bio}</p>
      ${terms(m)}
      <button class="pill" data-i="${i}">Full Profile</button>
    </div>`).join("");

  cardsContainer.querySelectorAll(".pill").forEach(b => {
    b.onclick = () => openProfile(+b.dataset.i);
  });
}

// Open Detailed Profile & File Tree
function openProfile(i) {
  const m = members[i];
  if ($("#cards")) $("#cards").hidden = true;
  const p = $("#profile");
  if (!p) return;

  p.hidden = false;
  p.innerHTML = `
    <div class="side">
      ${avatar(m)}
      <h2 class="name" id="p-name">${m.name}</h2>
      <p class="bio" id="p-bio">${m.bio}</p>
      ${terms(m)}
    </div>
    <div class="tree">
      <div class="row root">${icon("folder")} PORTFOLIO'S</div>
      <div id="tree-body" class="branch"></div>
      <div class="actions">
        <button class="edit" id="reload">${icon("pen")} Reload</button>
        <button class="edit" id="edit">${icon("pen")} Edit Profile</button>
        <button class="close" id="close">Close</button>
      </div>
    </div>`;

  p.querySelectorAll(".actions svg").forEach(s => {
    s.style.cssText = "width:16px;height:16px;fill:currentColor";
  });

  loadTree(m.repo, "", $("#tree-body"));

  $("#close").onclick = closeProfile;
  $("#edit").onclick = () => toggleEdit(i);
  $("#reload").onclick = () => reloadTree(m.repo);
  p.scrollIntoView({ behavior: "smooth", block: "start" });
}

const esc = t => String(t).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let freshUntil = 0;

// Fetch directory contents from GitHub REST API
async function fetchDir(repo, path) {
  const key = "gh:" + repo + ":" + path;
  try {
    const hit = sessionStorage.getItem(key);
    if (hit) return JSON.parse(hit);
  } catch (e) { }

  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path.split("/").map(encodeURIComponent).join("/")}`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: Date.now() < freshUntil ? "no-cache" : "default"
  });

  if (res.status === 404) throw new Error("Repo or folder not found. Check repository name and public visibility.");
  if (res.status === 403) throw new Error("GitHub rate limit reached. Please try again in a few minutes.");
  if (!res.ok) throw new Error("Could not load files from GitHub.");

  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch (e) { }
  return data;
}

function reloadTree(repo) {
  Object.keys(sessionStorage)
    .filter(k => k.startsWith("gh:" + repo + ":") || k.startsWith("gh2:" + repo + ":"))
    .forEach(k => sessionStorage.removeItem(k));
  freshUntil = Date.now() + 60000;
  loadTree(repo, "", $("#tree-body"));
}

// Populate file and folder tree
async function loadTree(repo, path, mount) {
  mount.innerHTML = '<p class="status">Loading from GitHub…</p>';
  try {
    const items = (await fetchDir(repo, path)).sort((x, y) => (x.type === "dir" ? 0 : 1) - (y.type === "dir" ? 0 : 1) || x.name.localeCompare(y.name));
    if (!items.length) {
      mount.innerHTML = '<p class="status">This folder is empty.</p>';
      return;
    }

    const ul = document.createElement("ul");
    items.forEach(it => {
      const li = document.createElement("li");
      if (it.type === "dir") {
        li.innerHTML = `<button class="row" aria-expanded="false">${icon("folder")} ${esc(it.name)}</button><div class="branch" hidden></div>`;
        const btn = li.firstChild, box = li.lastChild;
        btn.onclick = () => {
          const open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", !open);
          box.hidden = open;
          if (!open && !box.dataset.loaded) {
            box.dataset.loaded = 1;
            loadTree(repo, it.path, box);
          }
        };
      } else {
        li.innerHTML = `<a class="row file" href="${esc(it.html_url)}" target="_blank" rel="noopener">${icon("file")} ${esc(it.name)}</a>`;
      }
      ul.appendChild(li);
    });
    mount.replaceChildren(ul);
  } catch (err) {
    mount.innerHTML = `<p class="status err">${esc(err.message)}</p>`;
  }
}

// Toggle editable text fields for Name & Bio
function toggleEdit(i) {
  const els = [$("#p-name"), $("#p-bio")];
  const editing = els[0].isContentEditable;
  if (editing) {
    members[i].name = els[0].textContent.trim() || members[i].name;
    members[i].bio = els[1].textContent.trim() || members[i].bio;
    els.forEach(e => e.contentEditable = false);
    $("#edit").lastChild.textContent = " Edit Profile";
    renderCards();
  } else {
    els.forEach(e => e.contentEditable = true);
    els[0].focus();
    $("#edit").lastChild.textContent = " Save Profile";
  }
}

// Close expanded profile view
function closeProfile() {
  if ($("#profile")) $("#profile").hidden = true;
  if ($("#cards")) $("#cards").hidden = false;
}

// Initial render call
renderCards();