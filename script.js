const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;

// Couleurs magiques (Or, Violet, Bleu, Blanc)
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// ===============================================
// FONCTION POUR JOUER UN SON
// ===============================================
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0; // Rembobine si déjà en cours de lecture
        audio.play().catch(e => console.log("Erreur de lecture audio : " + e));
    }
}
// ===============================================

function toggleTheme() {
    body.classList.toggle('dark-mode');
    // Si vous avez un son pour le thème
    // playSound('soundTheme'); 
}

function toggleBook() {
    isOpen = !isOpen;
    
    // Si vous avez un son pour l'ouverture du livre
    // playSound('soundBook'); 

    if (isOpen) {
        bookContainer.classList.add('open');
        
        // ===============================================
        // DÉCLENCHEMENT DES SONS DE PAGE AU FEUILLETAGE
        // ===============================================
        const pageTurnDelay = 200; // Délai en ms entre chaque son de page
        
        // Page 1 (démarrage à 300ms après le clic)
        setTimeout(() => { playSound('soundPage'); }, 300); 
        
        // Page 2
        setTimeout(() => { playSound('soundPage'); }, 300 + pageTurnDelay); 
        
        // Page 3
        setTimeout(() => { playSound('soundPage'); }, 300 + (2 * pageTurnDelay)); 
        // ===============================================

        // Lancement de la magie après que toutes les pages sont tournées
        magicTimeout = setTimeout(startMagic, 2200); 
        
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopMagic();
    }
}

// Créer une particule
function createParticle() {
    // Sécurité : Si le livre n'est plus ouvert, on arrête
    if (!isOpen) return;

    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Taille aléatoire (petite et grande)
    const size = Math.random() * 8 + 3; 
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Couleur aléatoire + Glow
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;

    // POSITIONNEMENT CRITIQUE
    const rect = bookContainer.getBoundingClientRect();
    const startX = rect.left; 
    const startY = rect.top + rect.height / 2 + (Math.random() * 150 - 75); 
    
    particle.style.left = `${startX}px`;
    particle.style.top = `${startY}px`;

    // Définition des trajectoires (Variables CSS pour l'animation)
    const tx = (Math.random() - 0.5) * 50; 
    const txEnd = (Math.random() - 0.5) * 400; 
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);

    // Vitesse
    const duration = Math.random() * 2 + 2; 
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;

    document.body.appendChild(particle);

    // Nettoyage du DOM
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

function startMagic() {
    stopMagic();
    
    // Si vous avez un son pour la magie
    // playSound('soundMagic');
    
    // Explosion initiale
    for(let i=0; i<20; i++) setTimeout(createParticle, i * 50);
    // Flux continu
    particleInterval = setInterval(createParticle, 50);
}

function stopMagic() {
    if (particleInterval) clearInterval(particleInterval);
}
