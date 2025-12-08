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
        stopLumiere();
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


// BUTTON SECOUER
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



// BUTTON LUMIERE
function createLumiere() {
    if (!isOpen) return; // só cria feixe se o livro estiver aberto

    const beam = document.createElement('div');
    beam.classList.add('magic-beam');

    // posição inicial: centro do lumiereOrigin
    const origin = document.getElementById('lumiereOrigin').getBoundingClientRect();
    const startX = origin.left + origin.width / 2;
    const startY = origin.top + origin.height / 2;

    // posiciona o feixe
    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;
    beam.style.transform = 'translateX(-80%)';

    // adiciona ao body
    document.body.appendChild(beam);

    // remove automaticamente após animação
    setTimeout(() => beam.remove(), 2600);
}

let lumiereActive = false;

function toggleLumiere() {
    if (!isOpen) return;

    if (!lumiereActive) {
        startLumiere();
        lumiereActive = true;
    } else {
        stopLumiere();
        lumiereActive = false;
    }
}

function startLumiere() {
    stopLumiere();
    for (let i = 0; i < 100; i++) setTimeout(createLumiere, i * 100); // rajadas iniciais
    lumiereInterval = setInterval(createLumiere, 300); // feixe contínuo
}

function stopLumiere() {
    if (lumiereInterval) clearInterval(lumiereInterval);
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
    if (typeof stopLumiere === "function") stopLumiere();
    

    // Remove TODAS as partículas do ecrã
    document.querySelectorAll('.particle, .fire, .magic-beam').forEach(el => el.remove());   
 }


//feu
let fireActive = false;
let fireContainer = null;
let sparkInterval = null;

function toggleFire() {
    if (!isOpen) return; // feu seulement livre ouvert

    if (!fireActive) {
        startFire();
        fireActive = true;
    } else {
        stopFire();
        fireActive = false;
    }
}

function startFire() {
    stopFire(); // sécurité

    fireContainer = document.createElement("div");
    fireContainer.classList.add("fire-container");

    // Plusieurs flammes pour un effet réaliste
    for (let i = 0; i < 3; i++) {
        const flame = document.createElement("div");
        flame.classList.add("fire-flame");
        flame.style.animationDelay = `${i * 0.15}s`;
        flame.style.width = 25 + i * 10 + "px";
        flame.style.height = 60 + i * 20 + "px";
        fireContainer.appendChild(flame);
    }

    document.body.appendChild(fireContainer);

    // Étincelles continues
    sparkInterval = setInterval(spawnSpark, 80);
}

function stopFire() {
    if (fireContainer) {
        fireContainer.remove();
        fireContainer = null;
    }

    if (sparkInterval) {
        clearInterval(sparkInterval);
        sparkInterval = null;
    }
}

function spawnSpark() {
    if (!fireContainer) return;

    const spark = document.createElement("div");
    spark.classList.add("spark");

    const x = (Math.random() - 0.5) * 40;
    spark.style.left = `calc(50% + ${x}px)`;
    spark.style.bottom = "20px";

    fireContainer.appendChild(spark);

    setTimeout(() => spark.remove(), 1200);
}
