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
    if(sound){ sound.currentTime=0; sound.play().catch(()=>{});}
}

// ================== THEME ==================
btnTheme.addEventListener('click',()=>{ body.classList.toggle('dark-mode'); });

// ================== OUVERTURE LIVRE ==================
function toggleBook(){
    isOpen = !isOpen;
    if(isOpen){
        bookContainer.classList.add("open");
        playSound("soundPage");
        magicTimeout = setTimeout(startMagic,400);
    } else {
        bookContainer.classList.remove("open");
        stopMagic();
        if(fireActive) stopFire();
    }
}
bookContainer.addEventListener('click', toggleBook);

// ================== PARTICULES ==================
function createParticle(){
    if(!isOpen) return;
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random()*10+5;
    p.style.width = p.style.height = size+"px";
    const color = body.classList.contains("dark-mode") ? "#fff" : colors[Math.floor(Math.random()*colors.length)];
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
function startMagic(){ stopMagic(); particleInterval=setInterval(createParticle,25); }
function stopMagic(){ clearInterval(particleInterval); }

// ================== PAGES VOLANTES ==================
btnFly.addEventListener('click',()=>{
    if(!isOpen) toggleBook();
    const pages = bookContainer.querySelectorAll('.inner-page');
    pages.forEach(page=>{
        const clone = page.cloneNode(true);
        clone.classList.add('fly');
        document.body.appendChild(clone);
        setTimeout(()=>clone.remove(),3000);
    });
});

// ================== FEU ==================
let flameElements = [], smokeElement=null, ashInterval=null, sparkInterval=null;

function createSpark(){
    if(!fireActive) return;
    const spark=document.createElement('div'); spark.className='spark';
    spark.style.left='30px'; spark.style.top='60px';
    spark.style.setProperty('--sx',`${(Math.random()-0.5)*40}px`);
    spark.style.setProperty('--sy',`${-(Math.random()*60+20)}px`);
    fireContainer.appendChild(spark);
    setTimeout(()=>spark.remove(),600);
}
function startSparks(){ if(sparkInterval) clearInterval(sparkInterval); sparkInterval=setInterval(createSpark,80);}
function stopSparks(){ clearInterval(sparkInterval); sparkInterval=null;}

function startFire(){
    if(fireActive) return;
    fireActive=true;
    if(!isOpen) toggleBook();
    const r = bookContainer.getBoundingClientRect();
    fireContainer.style.left = r.left+r.width/2-40+'px';
   
