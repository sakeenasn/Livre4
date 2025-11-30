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
// Variables globales pour le feu avancé
let flameElements = [];
let smokeElement = null;
let ashInterval = null;
let sparkInterval = null;

// Étincelles
function createSpark(){
    if(!fireActive) return;
    const spark = document.createElement("div");
    spark.className = "spark";
    const r = fireContainer.getBoundingClientRect();
    spark.style.left = 30 + "px";
    spark.style.top  = 60 + "px";
    const tx = (Math.random()-0.5)*40 + "px";
    const ty = -(Math.random()*60 + 20) + "px";
    spark.style.setProperty("--sx", tx);
    spark.style.setProperty("--sy", ty);
    fireContainer.appendChild(spark);
    setTimeout(()=>spark.remove(),600);
}

function startSparks(){
    if(sparkInterval) clearInterval(sparkInterval);
    sparkInterval = setInterval(createSpark, 80);
}

function stopSparks(){
    clearInterval(sparkInterval);
    sparkInterval = null;
}

// Démarrer feu avancé
function startFire(){
    if(fireActive) return; // sécurité

    fireActive = true;
    if(!isOpen) toggleBook();

    // Position du conteneur feu
    const r = bookContainer.getBoundingClientRect();
    fireContainer.style.left = r.left + r.width/2 - 40 + "px";
    fireContainer.style.top  = r.top + r.height - 120 + "px";
    fireContainer.classList.add("active");
    stopMagic();

    // Flammes
    ["red","orange","yellow"].forEach(color=>{
        const f = document.createElement("div");
        f.className = "flame-adv " + color;
        fireContainer.appendChild(f);
        flameElements.push(f);
    });

    // Fumée
    if(!smokeElement){
        smokeElement = document.createElement("div");
        smokeElement.className = "smoke";
        fireContainer.appendChild(smokeElement);
    }

    // Étincelles
    startSparks();

    // Cendres
    ashInterval = setInterval(()=>{
        const ash = document.createElement("div");
        ash.className = "ash";
        ash.style.left = 30 + Math.random()*20 + "px";
        fireContainer.appendChild(ash);
        setTimeout(()=>ash.remove(),3000);
    },100);
}

// Arrêter feu avancé
function stopFire(){
    fireActive = false;
    fireContainer.classList.remove("active");

    // Supprimer flammes
    flameElements.forEach(f=>f.remove());
    flameElements = [];

    // Supprimer fumée
    if(smokeElement){
        smokeElement.remove();
        smokeElement = null;
    }

    // Étincelles
    stopSparks();

    // Cendres
    clearInterval(ashInterval);
    ashInterval = null;
}

// Toggle feu (bouton)
function toggleFire(){
    fireActive ? stopFire() : startFire();
}
