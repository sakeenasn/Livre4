const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;

// Couleurs magiques
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// 🔊 Jouer un son
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Erreur audio : " + e));
}

// 🌙 Changement d’ambiance
function toggleTheme() {
    body.classList.toggle('dark-mode');
}

// 📖 Ouverture / fermeture du grimoire
function toggleBook() {
    isOpen = !isOpen;

    if (isOpen) {
        bookContainer.classList.add('open');

        // Effet sonore des pages
        setTimeout(()=> playSound('soundPage'), 300);
        setTimeout(()=> playSound('soundPage'), 500);
        setTimeout(()=> playSound('soundPage'), 700);

        // Lancement magie après ouverture
        magicTimeout = setTimeout(startMagic, 2200);

    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
    }
}

// ✨ Génération d'une particule
function createParticle() {
    if (!isOpen) return;
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random()*8 + 3;
    p.style.width = p.style.height = size + "px";

    const color = colors[Math.floor(Math.random()*colors.length)];
    p.style.background = color;
    p.style.boxShadow = `0 0 ${size*2}px ${color}`;

    const rect = bookContainer.getBoundingClientRect();
    p.style.left = rect.left + "px";
    p.style.top  = (rect.top + rect.height/2 + (Math.random()*150-75)) + "px";

    p.style.setProperty('--tx',  `${(Math.random()-0.5)*50}px`);
    p.style.setProperty('--tx-end', `${(Math.random()-0.5)*400}px`);
    p.style.animation = `floatUp ${Math.random()*2+2}s ease-out forwards`;

    document.body.appendChild(p);
    setTimeout(()=> p.remove(), 3000);
}

// 🌟 Effet magie continu
function startMagic() {
    stopMagic();
    for(let i=0;i<20;i++) setTimeout(createParticle,i*50);
    particleInterval = setInterval(createParticle,50);
}

// 🛑 Stop effets
function stopMagic() {
    clearInterval(particleInterval);
}

// === Faisceau calé au CENTRE du livre ===
function triggerMagic(){
    const beam = document.createElement("div");
    beam.classList.add("magic-beam");
    document.body.appendChild(beam);

    const rect = bookContainer.getBoundingClientRect();

    // Centre horizontal
    beam.style.left = (rect.left + rect.width/2 - 350) + "px"; // 350 = moitié largeur triangle

    // Centre vertical exact du livre
    beam.style.top  = (rect.top + rect.height/2) + "px"; 

    setTimeout(()=>beam.remove(),2600);
}
