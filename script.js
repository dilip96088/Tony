const intro = document.getElementById("intro");
const mainContent = document.getElementById("mainContent");
const enterBtn = document.getElementById("enterBtn");
const cake = document.getElementById("cake");
const cakeHint = document.getElementById("cakeHint");
const cakeMessage = document.getElementById("cakeMessage");
const heartsLayer = document.getElementById("heartsLayer");
const confettiLayer = document.getElementById("confettiLayer");

const promiseSection = document.getElementById("promiseSection");
const promiseBtn = document.getElementById("promiseBtn");
const noPromiseBtn = document.getElementById("noPromiseBtn");
const promiseResponse = document.getElementById("promiseResponse");

const commentBox = document.getElementById("commentBox");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const copyCommentBtn = document.getElementById("copyCommentBtn");
const commentStatus = document.getElementById("commentStatus");

const colors = ["#ff4f91","#ff9fc5","#ffffff","#9d5cff","#ffd166","#7ef6d5"];
const funnyMessages = [
  "Nice try, madam. 😂",
  "Nope. The promise department rejected this. 😏",
  "Too slow! 🏃‍♂️",
  "The button has resigned. 😂",
  "You cannot escape this easily. ❤️",
  "404: Not Promise not found.",
  "Try again, gussi queen. 😭",
  "Your husband says NO. 😂"
];

enterBtn.addEventListener("click", () => {
  intro.style.transition = "opacity .8s ease, transform .8s ease";
  intro.style.opacity = "0";
  intro.style.transform = "scale(1.04)";
  setTimeout(() => {
    intro.classList.add("hidden");
    mainContent.classList.remove("hidden");
    window.scrollTo(0,0);
    launchConfetti(90);
    createHearts(18);
  }, 800);
});

function cutCake(){
  if(cake.dataset.cut === "yes") return;
  cake.dataset.cut = "yes";
  cake.classList.add("cut");
  cakeHint.textContent = "✨ Cake officially cut!";
  setTimeout(() => cakeMessage.classList.remove("hidden"), 450);
  launchConfetti(140);
  createHearts(25);
}
cake.addEventListener("click", cutCake);
cake.addEventListener("keydown", e => {
  if(e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    cutCake();
  }
});

function moveNoButton(){
  const box = document.querySelector(".promise-buttons");
  const boxRect = box.getBoundingClientRect();
  const btnRect = noPromiseBtn.getBoundingClientRect();
  const maxX = Math.max(30, (boxRect.width - btnRect.width) / 2 - 5);
  const maxY = Math.max(30, (boxRect.height - btnRect.height) / 2 - 5);
  const x = (Math.random() * 2 - 1) * maxX;
  const y = (Math.random() * 2 - 1) * maxY;
  noPromiseBtn.style.transform = `translate(${x}px,${y}px)`;
  promiseResponse.textContent = funnyMessages[Math.floor(Math.random()*funnyMessages.length)];
}
noPromiseBtn.addEventListener("mouseenter", moveNoButton);
noPromiseBtn.addEventListener("touchstart", e => { e.preventDefault(); moveNoButton(); }, {passive:false});
noPromiseBtn.addEventListener("click", e => { e.preventDefault(); moveNoButton(); });

promiseBtn.addEventListener("click", () => {
  promiseResponse.textContent = "Promise locked. Screenshot has been saved in my heart. 😂❤️";
  promiseBtn.textContent = "Promise Locked 🔒❤️";
  promiseBtn.disabled = true;
  launchConfetti(110);
  createHearts(22);
  setTimeout(() => document.querySelector(".comment-section").scrollIntoView({behavior:"smooth"}), 1200);
});

function launchConfetti(amount=80){
  for(let i=0;i<amount;i++){
    const p=document.createElement("div");
    p.className="confetti";
    p.style.left=Math.random()*100+"vw";
    p.style.background=colors[Math.floor(Math.random()*colors.length)];
    p.style.animationDuration=(2+Math.random()*3)+"s";
    p.style.animationDelay=(Math.random()*.7)+"s";
    p.style.width=(5+Math.random()*8)+"px";
    p.style.height=(9+Math.random()*10)+"px";
    p.style.borderRadius=Math.random()>.5?"2px":"50%";
    confettiLayer.appendChild(p);
    setTimeout(()=>p.remove(),6000);
  }
}

function createHearts(amount=10){
  for(let i=0;i<amount;i++){
    setTimeout(()=>{
      const h=document.createElement("div");
      h.className="floating-heart";
      h.textContent=Math.random()>.2?"❤️":"💗";
      h.style.left=Math.random()*100+"vw";
      h.style.fontSize=(14+Math.random()*26)+"px";
      h.style.animationDuration=(5+Math.random()*5)+"s";
      heartsLayer.appendChild(h);
      setTimeout(()=>h.remove(),10500);
    },i*140);
  }
}

setInterval(()=>{
  if(!mainContent.classList.contains("hidden")) createHearts(1);
},2800);

/* Guest message: send directly to Dilip through Formspree */
const emailForm = document.getElementById("emailForm");

function getMessage(){
  return commentBox.value.trim();
}

emailForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = getMessage();
  if(!message){
    commentStatus.textContent = "Write something for your husband first. ❤️";
    commentBox.focus();
    return;
  }

  sendCommentBtn.disabled = true;
  sendCommentBtn.textContent = "Sending your love... 💌";
  commentStatus.textContent = "Sending... please wait a second. ❤️";

  try{
    const response = await fetch(emailForm.action, {
      method: "POST",
      body: new FormData(emailForm),
      headers: {
        "Accept": "application/json"
      }
    });

    if(response.ok){
      commentStatus.textContent = "Message delivered to Dilip's inbox. ❤️💌";
      emailForm.reset();
      launchConfetti(70);
      createHearts(18);
      sendCommentBtn.textContent = "Message Sent ❤️";
      setTimeout(() => {
        sendCommentBtn.disabled = false;
        sendCommentBtn.textContent = "Send It To Your Husband ❤️";
      }, 3500);
    }else{
      let errorText = "Something went wrong. Please try again. ❤️";
      try{
        const data = await response.json();
        if(data && data.errors && data.errors.length){
          errorText = data.errors.map(err => err.message).join(" ");
        }
      }catch(_){}
      commentStatus.textContent = errorText;
      sendCommentBtn.disabled = false;
      sendCommentBtn.textContent = "Send It To Your Husband ❤️";
    }
  }catch(error){
    commentStatus.textContent = "Internet connection issue. Please try again. ❤️";
    sendCommentBtn.disabled = false;
    sendCommentBtn.textContent = "Send It To Your Husband ❤️";
  }
});

copyCommentBtn.addEventListener("click", async () => {
  const message = getMessage();
  if(!message){
    commentStatus.textContent = "Write a message first. ❤️";
    commentBox.focus();
    return;
  }

  try{
    await navigator.clipboard.writeText(message);
    commentStatus.textContent = "Copied! ❤️";
  }catch(err){
    commentBox.select();
    document.execCommand("copy");
    commentStatus.textContent = "Copied! ❤️";
  }
});

commentBox.addEventListener("input", () => {
  if(!sendCommentBtn.disabled) commentStatus.textContent = "";
});

document.addEventListener("dblclick",()=>{
  if(!mainContent.classList.contains("hidden")) launchConfetti(25);
});
