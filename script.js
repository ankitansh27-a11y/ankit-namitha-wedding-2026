(function(){
  const pre=document.getElementById('preloader');
  window.addEventListener('load',()=>setTimeout(()=>{pre.style.opacity='0';pre.style.visibility='hidden'},650));

  const menu=document.getElementById('menuBtn'),drawer=document.getElementById('drawer');

  // Wedding music: starts after the first user interaction (browser autoplay rules),
  // and can be controlled from the top-right Music button.
  const music=document.getElementById('weddingMusic'),musicToggle=document.getElementById('musicToggle');
  let musicStarted=false;
  function updateMusicButton(){
    const on=!music.paused;
    musicToggle.classList.toggle('playing',on);
    musicToggle.setAttribute('aria-pressed',String(on));
    musicToggle.setAttribute('aria-label',on?'Pause wedding music':'Play wedding music');
    musicToggle.innerHTML=on?'♫ <span>Playing</span>':'♫ <span>Music</span>';
  }
  async function startMusic(){
    if(musicStarted) return;
    try{await music.play();musicStarted=true;updateMusicButton();}
    catch(e){}
  }
  ['pointerdown','keydown','touchstart'].forEach(type=>window.addEventListener(type,startMusic,{once:true,passive:true}));
  musicToggle.addEventListener('click',async()=>{
    if(music.paused){try{await music.play();musicStarted=true}catch(e){}}
    else{music.pause();}
    updateMusicButton();
  });
  music.addEventListener('play',updateMusicButton);
  music.addEventListener('pause',updateMusicButton);
  updateMusicButton();
  menu.addEventListener('click',()=>{drawer.classList.toggle('open');drawer.setAttribute('aria-hidden',String(!drawer.classList.contains('open')))});
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')));

  const target=new Date('2026-12-04T09:00:00+05:30').getTime();
  function pad(n){return String(Math.max(0,n)).padStart(2,'0')}
  function tick(){let d=target-Date.now();if(d<0)d=0;document.getElementById('days').textContent=pad(Math.floor(d/86400000));document.getElementById('hours').textContent=pad(Math.floor(d%86400000/3600000));document.getElementById('minutes').textContent=pad(Math.floor(d%3600000/60000));document.getElementById('seconds').textContent=pad(Math.floor(d%60000/1000))}
  tick();setInterval(tick,1000);

  const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('visible')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Scratch card
  const card=document.getElementById('scratchCard'),canvas=document.getElementById('scratchCanvas'),ctx=canvas.getContext('2d');let drawing=false,remaining=1;
  function resize(){const r=card.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0);ctx.globalCompositeOperation='source-over';ctx.fillStyle='#b58a52';ctx.fillRect(0,0,r.width,r.height);ctx.fillStyle='#f1d9a9';ctx.font='600 14px DM Sans';ctx.textAlign='center';ctx.fillText('SCRATCH HERE ✦',r.width/2,r.height/2);ctx.globalCompositeOperation='destination-out';remaining=1}
  resize();window.addEventListener('resize',resize);
  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function erase(e){if(!drawing)return;const p=point(e);ctx.beginPath();ctx.arc(p.x,p.y,25,0,Math.PI*2);ctx.fill();remaining-=.014;if(remaining<.25){ctx.clearRect(0,0,r.width,r.height);drawing=false}}
  canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture(e.pointerId);erase(e)});canvas.addEventListener('pointermove',erase);canvas.addEventListener('pointerup',()=>drawing=false);canvas.addEventListener('pointercancel',()=>drawing=false);

  // Gallery lightbox
  const lb=document.getElementById('lightbox'),lbImg=document.getElementById('lightboxImg');document.querySelectorAll('.gallery-item').forEach(btn=>btn.addEventListener('click',()=>{lbImg.src=btn.dataset.full;lb.classList.add('open');lb.setAttribute('aria-hidden','false')}));
  document.getElementById('closeLightbox').addEventListener('click',()=>{lb.classList.remove('open');lb.setAttribute('aria-hidden','true')});lb.addEventListener('click',e=>{if(e.target===lb)document.getElementById('closeLightbox').click()});

  // Local wall of wishes
  const form=document.getElementById('wishForm'),wall=document.getElementById('wishWall'),key='ankitNamithaWishesV1';
  function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
  function render(){let arr=[];try{arr=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}wall.innerHTML=arr.map(x=>`<div class="wish"><strong>${esc(x.n)}</strong><p>${esc(x.w)}</p></div>`).join('')}
  form.addEventListener('submit',e=>{e.preventDefault();const n=document.getElementById('wishName').value.trim(),w=document.getElementById('wishText').value.trim();if(!n||!w)return;let arr=[];try{arr=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}arr.unshift({n,w});localStorage.setItem(key,JSON.stringify(arr.slice(0,30)));form.reset();render()});render();
})();
