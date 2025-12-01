const bookContainer = document.getElementById("bookContainer");
let isOpen = false;
let particles;

/* === OUVERTURE DU LIVRE === */
function toggleBook(){
    isOpen = !isOpen;
    bookContainer.classList.toggle("open");

    if(isOpen){
        setTimeout(()=>startMagic(), 1200); // Attendre que le livre s'ouvre
    } else {
        clearInterval(particles);
    }
}

/* === PARTICULES === */
function createParticle(){
    if(!isOpen) return;

    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.width  = p.style.height = (Math.random()*6+4)+"px";
    p.style.background = "rgba(255,255,200,0.9)";

    const rect=bookContainer.getBoundingClientRect();
    p.style.left = rect.left + rect.width*0.48 + "px";
    p.style.top  = rect.top  + rect.height*0.42 + "px";

    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3000);
}

/* === FAISCEAU 180° DU CENTRE DU LIVRE === */
function triggerMagic(){

    const beam = document.createElement("div");
    beam.classList.add("magic-beam");
    document.body.appendChild(beam);

    const rect = bookContainer.getBoundingClientRect();

    beam.style.left = rect.left + rect.width*0.165 + "px"; 
    beam.style.top  = rect.top  + rect.height*0.45 + "px";

    setTimeout(()=>beam.remove(),2800);
}

/* === LANCEMENT MAGIE === */
function startMagic(){
    triggerMagic();
    particles = setInterval(createParticle,80);
}
