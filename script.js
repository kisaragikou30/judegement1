const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const answers = ["","",""];

const $ = id => document.getElementById(id);
const value = id => $(id).value.trim();

document.querySelectorAll(".judge-row").forEach((row, i) => {
  row.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      answers[i] = btn.dataset.answer;
      row.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      draw();
    });
  });
});

function setInitialButtons(){
  document.querySelectorAll(".judge-row").forEach((row,i)=>{
    row.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
    if(answers[i]){
      const btn=row.querySelector(`[data-answer="${answers[i]}"]`);
      if(btn) btn.classList.add("active");
    }
  });
}
setInitialButtons();

["leftName","leftNumber","rightName","rightNumber"].forEach(id=>{
  $(id).addEventListener("input",draw);
});

function fit(text,max,font){
  ctx.font=`900 ${font}px Arial`;
  if(ctx.measureText(text).width<=max)return text;
  let s=text;
  while(s.length>1 && ctx.measureText(s+"…").width>max)s=s.slice(0,-1);
  return s+"…";
}

function circle(x,y,active){
  ctx.save();
  ctx.beginPath();ctx.arc(x,y,76,0,Math.PI*2);
  ctx.fillStyle=active?"#e50916":"#242a2c";ctx.fill();
  ctx.lineWidth=5;ctx.strokeStyle=active?"#ff4a52":"#666d70";ctx.stroke();
  ctx.beginPath();ctx.arc(x,y,61,0,Math.PI*2);
  ctx.lineWidth=2;ctx.strokeStyle="#0a0d0e";ctx.stroke();
  if(active){
    const g=ctx.createRadialGradient(x-18,y-20,4,x,y,62);
    g.addColorStop(0,"#ff8585");g.addColorStop(.28,"#ff1e2b");g.addColorStop(1,"#8d0008");
    ctx.beginPath();ctx.arc(x,y,58,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  }else{
    const g=ctx.createLinearGradient(0,y-60,0,y+60);
    g.addColorStop(0,"#73797b");g.addColorStop(.48,"#353b3d");g.addColorStop(1,"#15191a");
    ctx.beginPath();ctx.arc(x,y,58,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
  }
  ctx.restore();
}

function judge(y,n,answer){
  circle(210,y,answer==="left");
  circle(1390,y,answer==="right");

  ctx.textAlign="center";
  ctx.font="900 32px Arial";
  ctx.fillStyle="#fff";
  ctx.fillText(`JUDGE ${n}`,800,y-18);

  ctx.strokeStyle="#ed101f";ctx.lineWidth=5;
  ctx.beginPath();ctx.moveTo(455,y+20);ctx.lineTo(650,y+20);ctx.stroke();
  ctx.beginPath();ctx.moveTo(950,y+20);ctx.lineTo(1145,y+20);ctx.stroke();

  ctx.font="900 36px Arial";
  ctx.fillStyle=answer==="omt"?"#f01525":"#fff";
  const label = answer==="omt" ? "ONE MORE TIME" : answer==="left" ? "LEFT WINS" : answer==="right" ? "RIGHT WINS" : "";
  ctx.fillText(label,800,y+75);
}

function draw(){
  const W=1600,H=1200;
  ctx.clearRect(0,0,W,H);

  const bg=ctx.createLinearGradient(0,0,W,0);
  bg.addColorStop(0,"#111719");bg.addColorStop(.5,"#202729");bg.addColorStop(1,"#111719");
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);

  const glow=ctx.createRadialGradient(800,620,40,800,620,600);
  glow.addColorStop(0,"rgba(70,80,83,.18)");glow.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);

  ctx.textAlign="center";
  ctx.font="900 82px Arial";
  ctx.fillStyle="#f4f4f4";
  ctx.fillText("JUDGEMENT",800,105);
  ctx.fillStyle="#ed1528";ctx.fillRect(0,132,W,5);

  ctx.textAlign="left";
  ctx.font="800 22px Arial";ctx.fillStyle="#d5d8d9";
  ctx.fillText(fit(value("leftName")||"LEFT DRIVER",500,22),92,230);
  ctx.font="900 48px Arial";ctx.fillStyle="#fff";
  ctx.fillText(value("leftNumber")||"---",92,286);

  ctx.textAlign="right";
  ctx.font="800 22px Arial";
  ctx.fillText(fit(value("rightName")||"RIGHT DRIVER",500,22),1508,230);
  ctx.font="900 48px Arial";
  ctx.fillText(value("rightNumber")||"---",1508,286);

  ctx.textAlign="center";
  ctx.font="900 24px Arial";ctx.fillStyle="#e5e5e5";
  ctx.fillText("DRIFT BATTLE",800,250);
  ctx.font="700 16px Arial";ctx.fillStyle="#777";
  ctx.fillText("JUDGES RESULT",800,282);

  judge(430,1,answers[0]);
  judge(680,2,answers[1]);
  judge(930,3,answers[2]);

  // footer / decision
  const left=answers.filter(a=>a==="left").length;
  const right=answers.filter(a=>a==="right").length;
  let result="WAITING FOR JUDGEMENT";
  if(left>=2) result=`${value("leftName")||"LEFT DRIVER"} WINS`;
  else if(right>=2) result=`${value("rightName")||"RIGHT DRIVER"} WINS`;
  else if(answers.filter(Boolean).length===3 && answers.every(a=>a==="omt")) result="ONE MORE TIME";

  ctx.textAlign="center";
  ctx.font="900 24px Arial";ctx.fillStyle="#777";
  ctx.fillText("FINAL DECISION",800,1070);
  ctx.font="900 42px Arial";ctx.fillStyle="#ed1528";
  ctx.fillText(result,800,1120);
}

$("download").addEventListener("click",()=>{
  const a=document.createElement("a");
  a.download=`judgement_${value("leftName")||"left"}_vs_${value("rightName")||"right"}.png`;
  a.href=canvas.toDataURL("image/png");
  a.click();
});

$("reset").addEventListener("click",()=>{
  // 入力欄を完全に空にする
  $("leftName").value="";
  $("leftNumber").value="";
  $("rightName").value="";
  $("rightNumber").value="";

  // JUDGE 1〜3もすべて未選択にする
  answers.splice(0,3,"","","");
  document.querySelectorAll(".judge-row").forEach(row=>{
    row.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
  });
  draw();
});

draw();
