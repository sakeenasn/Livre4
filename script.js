const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;
let fireInterval = null;
let lumiereInterval = null;


// Cores mágicas para partículas
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// FUNÇÃO PARA TOCAR SOM
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Erro de áudio: " + e));
    }
}

// Alternar tema (dark/light)
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => { body.style.transition = ''; }, 1600);
}

// Abrir/fechar livro
function toggleBook() {
    isOpen = !isOpen;

    if (isOpen) {
        bookContainer.classList.add('open');

        // Sons das páginas
        const pageTurnDelay = 200;
        setTimeout(() => playSound('soundPage'), 300);
        setTimeout(() => playSound('soundPage'), 300 + pageTurnDelay);
        setTimeout(() => playSound('soundPage'), 300 + 2 * pageTurnDelay);

        // NÃO iniciar partículas automaticamente!
        // magicTimeout = setTimeout(startMagic, 500); // removido
    } else { 
        bookContainer.classList.remove('open'); 
        clearTimeout(magicTimeout); 
        stopMagic(); 
    }
 }
    
// BUTTON PARTICULES
function createParticle() {
    if (!isOpen) return; // só cria partículas se o livro estiver aberto

    const particle = document.createElement('div');
    particle.classList.add('particle');

    // tamanho aleatório
    const size = Math.random() * 12 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // cores mágicas
    const currentColors = body.classList.contains('dark-mode')
        ? ['#ffffff', '#cfcfcf', '#a0a0ff', '#ffd700', '#e0e0ff']
        : colors;

    const color = currentColors[Math.floor(Math.random() * currentColors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;

    // posição inicial: centro da lombada
   const origin = document.getElementById('particleOrigin').getBoundingClientRect();
   const startX = origin.left + origin.width / 2;
   const startY = origin.top + origin.height / 2;




    // trajetórias aleatórias
    const tx = (Math.random() - 0.5) * 120;
    const txEnd = (Math.random() - 0.5) * 700;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);

    // animação
    const duration = Math.random() * 2 + 2;
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;

    // adiciona ao body
    document.body.appendChild(particle);

    // remove automaticamente após animação
    setTimeout(() => particle.remove(), duration * 1000);
}


let particlesActive = false;

function rainbowParticles() {
    if (!isOpen) return; // Só funciona se o livro estiver aberto

    if (!particlesActive) {
        startMagic();
        particlesActive = true;
    } else {
        stopMagic();
        particlesActive = false;
    }
}

function startMagic() {
    stopMagic();
    for (let i = 0; i < 100; i++) setTimeout(createParticle, i * 15);
    particleInterval = setInterval(createParticle, 15);
}

function stopMagic() {
    if (particleInterval) clearInterval(particleInterval);
}

// BUTTON VENT
function flyPages() {
    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');

    pages.forEach((page, i) => {
        setTimeout(() => {
            const flyingPage = page.cloneNode(true);
            const rect = page.getBoundingClientRect();

            flyingPage.style.position = 'absolute';
            flyingPage.style.left = `${rect.left}px`;
            flyingPage.style.top = `${rect.top}px`;
            flyingPage.style.width = `${rect.width}px`;
            flyingPage.style.height = `${rect.height}px`;
            flyingPage.style.zIndex = 1000;
            flyingPage.style.pointerEvents = 'none';
            flyingPage.style.transition = 'transform 4s ease-out, opacity 4s ease-out';

            document.body.appendChild(flyingPage);

            // Trajetória aleatória simulando vento
            const endX = (Math.random() - 0.5) * window.innerWidth * 2;
            const endY = (Math.random() - 0.5) * window.innerHeight * 2;
            const rotateX = (Math.random() - 0.5) * 1080;
            const rotateY = (Math.random() - 0.5) * 1080;

            requestAnimationFrame(() => {
                flyingPage.style.transform = `translate(${endX}px, ${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                flyingPage.style.opacity = 0;
            });

            setTimeout(() => flyingPage.remove(), 4000);
        }, i * 100);
    });
}

function shakeBook() {
    if (!isOpen) {
        toggleBook(); // abre o livro
        // espera 1.2s até a animação do livro abrir
        setTimeout(() => {
            bookContainer.classList.add('shake');
            setTimeout(() => bookContainer.classList.remove('shake'), 500);
        }, 1200);
    } else {
        // se já estiver aberto
        bookContainer.classList.add('shake');
        setTimeout(() => bookContainer.classList.remove('shake'), 500);
    }
}



// BUTTON FEU
function spawnFire() {
    const flameBox = document.createElement("div");
    flameBox.style.position = "absolute";
    flameBox.style.left = "50%";
    flameBox.style.top = "50%";
    flameBox.style.width = "50px";
    flameBox.style.height = "50px";
    flameBox.style.background = "red";
    flameBox.style.zIndex = 9999;
    flameBox.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(flameBox);
}




function resetBook() {
    // Fecha o livro
    isOpen = false;
    bookContainer.classList.remove('open');

    // DESATIVAR SEMPRE o dark mode
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
    }

    // Para partículas mágicas
    if (typeof stopMagic === "function") stopMagic();

    // Para fogo
    if (typeof stopFire === "function") stopFire();

    // Para Lumière
    if (lumiereInterval) {
        clearInterval(lumiereInterval);
        lumiereInterval = null;
    }

    // Remove TODAS as partículas do ecrã
    document.querySelectorAll('.particle, .fire, .lumiere-particle').forEach(el => el.remove());
}


//button lumiere
function toggleLumiere() {
    if (!isOpen) return; // ne rien faire si le livre est fermé

    const beam = document.createElement('div');
    beam.classList.add('magic-beam');
    document.body.appendChild(beam);

    // Récupère le centre du particleOrigin
    const origin = document.getElementById('particleOrigin').getBoundingClientRect();
    const centerX = origin.left + origin.width / 2;
    const centerY = origin.top + origin.height / 2;

    const beamWidth = 700; // largeur du faisceau

    // Centre le faisceau sur particleOrigin
    beam.style.left = `${centerX - beamWidth / 2}px`;
    beam.style.top  = `${centerY}px`;

    setTimeout(() => beam.remove(), 2600);
}
