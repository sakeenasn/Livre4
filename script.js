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
function startFire(){
    fireActive = true;
    if(!isOpen) toggleBook(); // Le livre doit être ouvert

    const r = bookContainer.getBoundingClientRect();
    fireContainer.style.left = r.left+r.width/2-30+"px";
    fireContainer.style.top  = r.top+r.height-60+"px";
    
    
// 🔥 Crée des étincelles dans le feu
function createSpark(){
    if(!fireActive) return;

    const spark = document.createElement("div");
    spark.className = "spark";

    // position au centre du feu
    const r = fireContainer.getBoundingClientRect();
    spark.style.left = r.width/2 + "px";
    spark.style.top  = r.height/2 + "px";

    // trajectoire aléatoire
    const tx = (Math.random()-0.5)*40 + "px";
    const ty = -(Math.random()*60 + 20) + "px";
    spark.style.setProperty("--sx", tx);
    spark.style.setProperty("--sy", ty);

    fireContainer.appendChild(spark);
    setTimeout(()=>spark.remove(),600);
}

// boucle pour créer les étincelles régulièrement
let sparkInterval;
function startSparks(){
    if(sparkInterval) clearInterval(sparkInterval);
    sparkInterval = setInterval(createSpark, 80);
}

function stopSparks(){
    clearInterval(sparkInterval);
}

// Modification du toggleFire pour inclure les étincelles
function startFire(){
    fireActive = true;
    if(!isOpen) toggleBook();

    const r = bookContainer.getBoundingClientRect();
    fireContainer.style.left = r.left + r.width/2 - 30 + "px";
    fireContainer.style.top  = r.top + r.height - 80 + "px";

    fireContainer.classList.add("active");
    stopMagic();
    startSparks();
}

function stopFire(){
    fireActive = false;
    fireContainer.classList.remove("active");
    stopSparks();
}

    fireContainer.classList.add("active");
    stopMagic();
}

function stopFire(){
    fireActive = false;
    fireContainer.classList.remove("active");
}

function toggleFire(){
    fireActive ? stopFire() : startFire();
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
