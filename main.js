// les variables globales qu'on va utiliser un peu partout
var htmlAppDiv; // le <div> qui contient notre "application"
var htmlVid; // l'elt html du player <video>
var currVid; // le numéro de la vidéo actuelle

// l'équivalent du start() en p5.js
window.onload = function start() {
    htmlAppDiv =  document.getElementById("app"); //on récup le <div> de notre app (cf l'html)
    htmlVid = document.createElement("video"); // on crée un player <video>
    currVid = getRandomVid(); // on demande un nouvea numéro de vidéo aléatoire
    htmlVid.setAttribute("src", vidPath(currVid)); // on met la vidéo en SRC de l'elt <video>
    htmlVid.setAttribute("loop","");
    htmlVid.setAttribute("autoplay","");
    htmlAppDiv.appendChild(htmlVid); // on ajoute la vidéo dans le <div> de notre app
}

// pour chaque bouton de la page, récupéré par son ID, tu ajoutes une fonction qui dit
// ce que va faire ce bouton
document.getElementById('autre').onclick = function changeVid() {
  currVid = getRandomVid(); // on récup un nouveau numéro de vid aléatoire
  htmlVid.setAttribute("src", vidPath(currVid)); // on change le SRC
}

// fonction qui génère un numéro de vid aléatoire, en évitant de faire 2 fois le même numéro de suite
function getRandomVid() {
  n = currVid;
  while(n == currVid){ // "tant que c'est toujours le même numéro que celui de la vid actuelle"
    n = Math.floor(Math.random() * 3); // tu génères un nouveau numéro entre 0 et 3 (si tu as 4 vidéos, de 000.mp4 à 003.mp4)
  }
  return n;
}

// fonction qui transforme le numéro - par exemple "2" - en un chemin vers la vidéo -> "videos/002.mp4"
function vidPath(id){
  s = String(id).padStart(3, '0'); // transforme "2" en "002"
  return "videos/" + s + ".mp4";
}
