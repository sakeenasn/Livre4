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
    const sound = document.getElementById(id);
    if(sound){
        sound.currentTime = 0;
        sound.play().catch(()=>{});
    }
}

// ================== THEME ==================
btnTheme.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    body.style.transition = "1.5s";
});

// ================== OUVERTURE LIVRE ==================
bookContainer.addEventListener("click", toggleBook);

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

// ================== PAGES VOLANTES ==================
btnFly.addEventListener("click", flyPages);

function flyPages(){
    const pages = bookContainer.querySelectorAll(".inner-page");
    pages.forEach((page, index) => {
        page.classList.add("fly");
        // On enlève la classe après l'animation
        page.addEventListener("animationend", ()=> page.classList.remove("fly"), {once:true});
    });
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

// Toggle feu
btnFire.addEventListener("click", toggleFire);

function startFire(){
    if(fireActive) return;
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

function stopFire(){
    fireActive = false;
    fireContainer.classList.remove("active");

    flameElements.forEach(f=>f.remove());
    flameElements = [];

    if(smokeElement){
        smokeElement.remove();
        smokeElement = null;
    }

    stopSparks();

    clearInterval(ashInterval);
    ashInterval = null;
}

function toggleFire(){
    fireActive ? stopFire() : startFire();
}
