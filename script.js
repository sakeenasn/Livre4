// ================== SELECTEURS ==================
const bookContainer = document.getElementById('bookContainer');
const fireContainer = document.getElementById('fireContainer');
const body = document.body;

const btnTheme = document.getElementById("themeBtn");
const btnFly   = document.getElementById("flyBtn");
const btnFire  = document.getElementById("fireBtn");

// ================== VARIABLES ==================
let isOpen = false;
let fireActive = false;
let particleInterval;
let magicTimeout;

const colors = ['#ffd700','#ff9a9e','#a18cd1','#ffffff','#84fab0'];


// ================== SONS ==================
function playSound(id){
    let sound = document.getElementById(id);
    if(sound){
        sound.currentTime = 0;
        sound.play().catch(()=>{});
    }
}


// ================== THEME ==================
function toggleTheme(){
    body.classList.toggle("dark-mode");
    body.style.transition = "1.5s";
}


// ================== OUVERTURE LIVRE ==================
function toggleBook(){
    if(fireActive && isOpen) return; // Sécurité

    isOpen = !isOpen;

    if(isOpen){
        bookContainer.classList.add("open");
        playSound("soundPage");

        magicTimeout = setTimeout(startMagic, 400);
    } else {
        bookContainer.classList.remove("open");
        stopMagic();

        if(fireActive) stopFire();
    }
}


// ================== EFFET PARTICULES ==================
function createParticle(){
    if(!isOpen) return;

    const p = document.createElement("div");
    p.className = "particle";

    const size = Math.random()*10+5;
    p.style.width = p.style.height = size+"px";

    const color = body.classList.contains("dark-mode")
        ? "#ffffff" : colors[Math.floor(Math.random()*colors.length)];

    p.style.background = color;
    p.style.boxShadow = `0 0 ${size*3}px ${color}`;

    const r = bookContainer.getBoundingClientRect();
    p.style.left = `${r.left+r.width/2}px`;
    p.style.top  = `${r.top+r.height/2}px`;

    p.style.setProperty("--tx", `${(Math.random()-0.5)*120}px`);
    p.style.setProperty("--tx-end", `${(Math.random()-0.5)*700}px`);

    p.style.animation = `floatUp ${2+Math.random()*2}s ease-out forwards`;

    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3000);
}

function startMagic(){
    stopMagic();
    particleInterval = setInterval(createParticle,25);
}
function stopMagic(){
    clearInterval(particleInterval);
}


// ================== FEU ==================
let flameElements = [];
let smokeElement;
let ashInterval;

// 🔥 Démarrer feu avancé
function startFire(){
    fireActive = true;
    if(!isOpen) toggleBook();

    const r = bookContainer.getBoundingClientRect();
    fireContainer.style.left = r.left + r.width/2 - 40 + "px";
    fireContainer.style.top  = r.top + r.height - 120 + "px";
    fireContainer.classList.add("active");
    stopMagic();

    // Création flammes
    ["red","orange","yellow"].forEach(color=>{
        const f = document.createElement("div");
        f.className = "flame-adv " + color;
        fireContainer.appendChild(f);
        flameElements.push(f);
    });

    // Création fumée
    smokeElement = document.createElement("div");
    smokeElement.className = "smoke";
    fireContainer.appendChild(smokeElement);

    // Étincelles
    startSparks();

    // Cendres tombantes
    ashInterval = setInterval(()=>{
        const ash = document.createElement("div");
        ash.className = "ash";
        ash.style.left = 30 + Math.random()*20 + "px"; // position dans le feu
        fireContainer.appendChild(ash);
        setTimeout(()=>ash.remove(),3000);
    },100);
}

// 🔥 Arrêter feu avancé
function stopFire(){
    fireActive = false;
    fireContainer.classList.remove("active");

    // Supprimer flammes
    flameElements.forEach(f=>f.remove());
    flameElements = [];

    // Supprimer fumée
    if(smokeElement) smokeElement.remove();
    smokeElement = null;

    stopSparks();
    clearInterval(ashInterval);
}

// ================== PAGES VOLANTES ==================
function flyPages(){
    document.querySelectorAll(".page").forEach((page,i)=>{
        setTimeout(()=>{
            const p = page.cloneNode(true);
            const r = page.getBoundingClientRect();

            p.style.cssText = `
               position:absolute;
               left:${r.left}px; top:${r.top}px;
               width:${r.width}px; height:${r.height}px;
               z-index:2000;
               transform:rotateX(0deg);
               pointer-events:none;
               transition:4s;
            `;

            document.body.appendChild(p);

            setTimeout(()=>{
                p.style.transform = `
                    translate(${(Math.random()-0.5)*800}px,
                              ${(Math.random()-0.5)*600}px)
                    rotateX(${Math.random()*360}deg)
                    rotateY(${Math.random()*360}deg)`;
                p.style.opacity = 0;
            },30);

            setTimeout(()=>p.remove(),4500);
        },i*150);
    });
}


// ================== EVENEMENTS ==================
bookContainer.addEventListener("click", toggleBook);
btnTheme.addEventListener("click", toggleTheme);
btnFly.addEventListener("click", flyPages);
btnFire.addEventListener("click", toggleFire);
