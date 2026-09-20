const quizData = {
  Mathematik: [
    {q:"Was ist 7 × 8?", a:["54","56","64","48"], c:1},
    {q:"Welche Zahl ist eine Primzahl?", a:["21","27","29","33"], c:2},
    {q:"Wie viel sind 25 % von 80?", a:["10","15","20","25"], c:2}
  ],
  Biologie: [
    {q:"Welches Organell stellt hauptsächlich Energie in Form von ATP bereit?", a:["Zellkern","Mitochondrium","Ribosom","Vakuole"], c:1},
    {q:"Wo befindet sich die Erbinformation einer menschlichen Zelle hauptsächlich?", a:["Zellkern","Zellwand","Vakuole","Golgi-Apparat"], c:0},
    {q:"Was nehmen Pflanzen bei der Fotosynthese aus der Luft auf?", a:["Sauerstoff","Stickstoff","Kohlenstoffdioxid","Helium"], c:2}
  ],
  Deutsch: [
    {q:"Was ist ein Verb?", a:["Tun-/Zustandswort","Eigenschaftswort","Begleiter","Fürwort"], c:0},
    {q:"Was bezeichnet das Metrum eines Gedichts?", a:["Reimschema","Versmaß","Thema","Autor"], c:1},
    {q:"Welche Wortart ist „schnell“?", a:["Nomen","Verb","Adjektiv","Artikel"], c:2}
  ],
  Englisch: [
    {q:"What is the past tense of “go”?", a:["goed","went","gone","goes"], c:1},
    {q:"Which word means “Haus”?", a:["house","horse","mouse","homework"], c:0},
    {q:"Complete: “She ___ a book.”", a:["read","reads","reading","are read"], c:1}
  ]
};

let currentSubject="Mathematik", currentIndex=0, answered=false;
let score=Number(localStorage.getItem("lernstartScore")||0);
let total=Number(localStorage.getItem("lernstartTotal")||0);

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function updateProgress(){
  $("#score").textContent=score;
  const pct=total ? Math.round((score/total)*100) : 0;
  $("#bar").style.width=Math.min(pct,100)+"%";
  $("#barText").textContent=pct+"%";
  localStorage.setItem("lernstartScore",score);
  localStorage.setItem("lernstartTotal",total);
}
function renderQuestion(){
  const q=quizData[currentSubject][currentIndex];
  $("#quizSubject").textContent=currentSubject;
  $("#quizCount").textContent=`Frage ${currentIndex+1} / ${quizData[currentSubject].length}`;
  $("#question").textContent=q.q;
  $("#answers").innerHTML="";
  $("#feedback").textContent="Wähle eine Antwort.";
  $("#nextBtn").disabled=true;
  answered=false;
  q.a.forEach((text,i)=>{
    const b=document.createElement("button");
    b.className="answer"; b.textContent=text;
    b.onclick=()=>chooseAnswer(i);
    $("#answers").appendChild(b);
  });
}
function chooseAnswer(i){
  if(answered)return;
  answered=true; total++;
  const q=quizData[currentSubject][currentIndex];
  const buttons=[...document.querySelectorAll(".answer")];
  buttons.forEach((b,n)=>{b.disabled=true;if(n===q.c)b.classList.add("correct");});
  if(i===q.c){score++;$("#feedback").textContent="Richtig! Stark gemacht."}
  else {buttons[i].classList.add("wrong");$("#feedback").textContent=`Nicht ganz – richtig wäre „${q.a[q.c]}“.`}
  $("#nextBtn").disabled=false; updateProgress();
}
$("#nextBtn").onclick=()=>{
  currentIndex++;
  if(currentIndex>=quizData[currentSubject].length)currentIndex=0;
  renderQuestion();
};
$$(".filter").forEach(btn=>btn.onclick=()=>{
  $$(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  currentSubject=btn.dataset.filter;currentIndex=0;renderQuestion();
});
$$(".subject").forEach(btn=>btn.onclick=()=>{
  const subject=btn.dataset.subject;
  const map={Mathematik:"Mathe",Deutsch:"Deutsch",Englisch:"Englisch",Biologie:"Bio"};
  if(quizData[subject]){$$(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===subject));currentSubject=subject;currentIndex=0;renderQuestion();document.querySelector("#quiz").scrollIntoView({behavior:"smooth"});}
  else showToast(`${subject} ist vorbereitet – weitere Aufgaben folgen.`);
});
$("#search").oninput=e=>{
  const term=e.target.value.toLowerCase().trim();let visible=0;
  $$(".subject").forEach(x=>{const yes=x.dataset.name.toLowerCase().includes(term);x.style.display=yes?"":"none";if(yes)visible++;});
  $("#empty").style.display=visible?"none":"block";
};
function showToast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2200)}
$("#year").textContent=new Date().getFullYear();
updateProgress();renderQuestion();
