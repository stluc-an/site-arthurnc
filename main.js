// les variables globales qu'on va utiliser un peu partout
var htmlAppDiv; // le <div> qui contient notre "application"
var htmlVid; // l'elt html du player <video>
var htmlSubDisplay; // là où on affiche les ss-titres
var htmlFormSubtitle; // l'élement où on introduit le texte
var htmlFormSubmit; // le bouton pour envoyer
var currVidId; // le numéro de la vidéo actuelle
var lastSubs; // tableau des x derniers subs
var nLastSubs = 5; // combien de subs on charge pour jouer le film
var sceneLength = 2000; // durée d'affichage d'une scène en millisecondes

// Définir la DB
var db = new Dexie("subtitles");
db.version(1).stores({
    subtitles: '++id,vid,sub'
    // la DB contiendra une table "subtitles" avec 3 champs
    // "id", identifiant unique, autoincrémenté
    // "vid", id de la vidéo
    // "sub", le ss-titre écrit
});

// l'équivalent du setup() en p5.js
window.onload = function start() {
    htmlAppDiv =  document.getElementById("app"); //on récup le <div> de notre app (cf l'html)
    htmlVid = document.createElement("video"); // on crée un player <video>
    changeRandomVid()
    htmlVid.setAttribute("loop","");
    htmlVid.setAttribute("autoplay","");
    htmlAppDiv.appendChild(htmlVid); // on ajoute la vidéo dans le <div> de notre app

    htmlFormSubtitle = document.getElementById('subtitle');
    htmlFormSubmit = document.getElementById('submit');
    htmlSubDisplay = document.getElementById('subdisplay');
}

// ajout d'une phrase dans la DB
document.getElementById('submit').onclick = function changeVid() {
  subTxt = htmlFormSubtitle.value;

  db.subtitles.put({ // on ajoute les infos dans les 2 champs de la DB
    vid: currVidId,
    sub: subTxt
    // le champs "++id" défini plus haut s'update tout seul, 1, 2, 3, 4, etc

  }).then (function(){
      // quand l'ajout est terminé, qu'est-ce qu'on fait?
      htmlFormSubtitle.value = ""; // on enlève l'ancien texte du champs
      doSomethingWithLastSubs(5)
  }).catch(function(error) {
     console.log ("Un truc a merdé avec la DB: " + error);
  });
}

function doSomethingWithLastSubs(n){
  db.subtitles.toArray().then(function(tab){
    lastSubs = tab.slice(-n);
    console.log(lastSubs);
    playFilm();
  })
}


async function playFilm(){
  htmlFormSubmit.style.display = "none";
  htmlFormSubtitle.style.display = "none";

  for(let i = 0; i < lastSubs.length; i++) {
    htmlVid.setAttribute("src", vidPath(lastSubs[i].vid));
    htmlSubDisplay.innerHTML = lastSubs[i].sub;
    currVidId = lastSubs[i].vid; // à la fin, ça permettra d'éviter qu'on rejoue la même vid que la dernière
    await sleep(sceneLength);
  }
  htmlSubDisplay.innerHTML = ""

  htmlFormSubmit.style.display = "inline";
  htmlFormSubtitle.style.display = "inline";

  changeRandomVid();
}





// FONCTIONS UTILITAIRES
// =============================================================================

// ça nous donne une nouvelle vidéo aléatoire
function changeRandomVid() {
  currVidId = getRandomVidId(); // on récup un nouveau numéro de vid aléatoire
  htmlVid.setAttribute("src", vidPath(currVidId)); // on change le SRC
}

// fonction qui génère un numéro de vid aléatoire, en évitant de faire 2 fois le même numéro de suite
function getRandomVidId() {
  n = currVidId;
  while(n == currVidId){ // "tant que c'est toujours le même numéro que celui de la vid actuelle"
    n = Math.floor(Math.random() * 3); // tu génères un nouveau numéro entre 0 et 3 (si tu as 4 vidéos, de 000.mp4 à 003.mp4)
  }
  return n;
}

// fonction qui transforme le numéro - par exemple "2" - en un chemin vers la vidéo -> "videos/002.mp4"
function vidPath(id){
  s = String(id).padStart(3, '0'); // transforme "2" en "002"
  return "videos/" + s + ".mp4";
}

// nettoyage de la DB
// associée à aucun bouton sur le site, mais tu peux taper dans la console "clearDB()", ça marche
function clearDB(){
  db.subtitles.clear().then (function(){
      console.log("On a nettoyé la DB")
      console.log()
  }).catch(function(error) {
     console.log ("Le nettoyage de la DB à foiré: " + error);
  });
}

// interrompre le code pendant x millisecondes
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
