const $=s=>document.querySelector(s), mem={};
const st={get(k, d) {
    try {
      const v=localStorage.getItem('nd_'+k);
      return v==null?d:JSON.parse(v)
    } catch(e) {
      return k in mem?mem[k]:d
    }
  },
  set(k, v) {
    mem[k]=v;
    try {
      localStorage.setItem('nd_'+k, JSON.stringify(v))
    } catch(e) {

    }
  }};

let coins=st.get('coins', 0), sel=st.get('sel', 'roxo'), own=st.get('own', ['roxo']), done=st.get('done', []), lvl=st.get('lvl', 1), env=st.get('env', 0);
const save=()=> {
  st.set('coins', coins);
  st.set('sel', sel);
  st.set('own', own);
  st.set('done', done);
  st.set('lvl', lvl);
  st.set('env', env)
};
const LIBERAR_AMBIENTES = false, LIBERAR_NIVEIS = false;
const lid=(e, n)=>e*100+n, envDone=e=> {
  let c=0;
  for(let n=1;n<=15;n++)if(done.includes(lid(e, n)))c++;
  return c
}, envOpen=e=>LIBERAR_AMBIENTES||e==0||envDone(e-1)==15;
const CH=[{id:'roxo', n:'ROXO', c:'#9b4dff', t:'#ff6bf0', p:0}, {id:'rosa', n:'ROSA', c:'#ff7eb6', t:'#ff9fd0', p:20, a:'bow'},
  {id:'azul', n:'AZUL', c:'#3d8bff', t:'#6fc3ff', p:30, a:'shades'}, {id:'amarelo', n:'AMARELO', c:'#ffd23d', t:'#ffe066', p:30, a:'crown'},
  {id:'verde', n:'VERDE', c:'#4fe04a', t:'#8dff7a', p:40, a:'headset'}, {id:'laranja', n:'LARANJA', c:'#ff9a2e', t:'#ffb45c', p:40, a:'hat'},
  {id:'branco', n:'BRANCO', c:'#f4f0ff', t:'#9ff4ff', p:50, a:'wings'}, {id:'preto', n:'PRETO', c:'#2b2433', t:'#c58cff', p:60, a:'cape'}];
const cur=()=>CH.find(c=>c.id===sel)||CH[0];

function drawCube(g, ch, s) {

  const R=(x, y, w, h, r)=> {
    g.beginPath();
    g.roundRect(x, y, w, h, r)
  };
  g.save();

  if(ch.a=='wings') {
    g.fillStyle='#fff';
    for(const d of[-1, 1]) {
      g.beginPath();
      g.ellipse(d*s*.62, -s*.05, s*.2, s*.36, d*.5, 0, 7);
      g.fill()
    }
  }

  if(ch.a=='cape') {
    g.fillStyle='#3a2058';
    g.beginPath();
    g.moveTo(-s*.58, -s*.3);
    g.lineTo(s*.58, -s*.3);
    g.lineTo(s*.72, s*.5);
    g.lineTo(-s*.72, s*.5);
    g.fill()
  }

  g.shadowColor=ch.t;
  g.shadowBlur=s*.3;
  g.fillStyle=ch.c;
  R(-s/2, -s/2, s, s, s*.18);
  g.fill();
  g.shadowBlur=0;

  g.strokeStyle='rgba(255,255,255,.75)';
  g.lineWidth=s*.04;
  g.stroke();

  g.fillStyle='#14002e';
  for(const d of[-1, 1]) {
    g.beginPath();
    g.arc(d*s*.2, -s*.05, s*.09, 0, 7);
    g.fill()
  }

  g.strokeStyle='#14002e';
  g.lineWidth=s*.04;
  g.beginPath();
  g.arc(0, s*.06, s*.12, .2, Math.PI-.2);
  g.stroke();

  const a=ch.a;

  if(a=='bow') {
    g.fillStyle='#ff4fa0';
    g.beginPath();
    g.moveTo(-s*.2, -s*.56);
    g.lineTo(-s*.42, -s*.7);
    g.lineTo(-s*.42, -s*.42);
    g.moveTo(-s*.2, -s*.56);
    g.lineTo(0, -s*.7);
    g.lineTo(0, -s*.42);
    g.fill()
  }

  if(a=='shades') {
    g.fillStyle='#0a0a12';
    R(-s*.38, -s*.17, s*.76, s*.2, s*.06);
    g.fill()
  }

  if(a=='crown') {
    g.fillStyle='#ffc800';
    g.beginPath();
    g.moveTo(-s*.3, -s*.5);
    g.lineTo(-s*.34, -s*.8);
    g.lineTo(-s*.15, -s*.65);
    g.lineTo(0, -s*.85);
    g.lineTo(s*.15, -s*.65);
    g.lineTo(s*.34, -s*.8);
    g.lineTo(s*.3, -s*.5);
    g.fill()
  }

  if(a=='headset') {
    g.strokeStyle='#111';
    g.lineWidth=s*.07;
    g.beginPath();
    g.arc(0, -s*.05, s*.52, Math.PI, 0);
    g.stroke();
    g.fillStyle='#111';
    for(const d of[-1, 1]) {
      R(d*s*.52-s*.07, -s*.2, s*.14, s*.3, s*.05);
      g.fill()
    }
  }

  if(a=='hat') {
    g.fillStyle='#8a5a2b';
    g.beginPath();
    g.ellipse(0, -s*.5, s*.8, s*.13, 0, 0, 7);
    g.fill();
    R(-s*.3, -s*.8, s*.6, s*.32, s*.08);
    g.fill()
  }

  g.restore()
}

function icon(cv, ch) {
  const g=cv.getContext('2d');
  g.clearRect(0, 0, cv.width, cv.height);
  g.save();
  g.translate(cv.width/2, cv.height/2+8);
  drawCube(g, ch, cv.width*.5);
  g.restore()
}

function toast(m) {
  const t=$('#toast');
  t.textContent=m;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t=setTimeout(()=>t.classList.remove('on'), 1600)
}

function show(id) {
  document.querySelectorAll('.screen:not(#win)').forEach(s=>s.classList.toggle('on', s.id===id));
  run=id==='game';
  if(run) {
    last=performance.now();
    requestAnimationFrame(loop)
  }

  if(id==='menu')renderMenu();
  if(id==='chars')renderChars();
  if(id==='envs')renderEnvs();
  if(id==='levels')renderLevels();
  if(id==='cfg')renderCfg()
}

function renderMenu() {
  icon($('#mcube'), cur());
  $('#cm').textContent=coins
}

function renderChars() {

  $('#cc').textContent=coins;
  const grid=$('#grid');
  grid.innerHTML='';

  CH.forEach(ch=> {
    const owned=own.includes(ch.id), is=sel===ch.id, d=document.createElement('div');

    d.className='card'+(is?' sel':'')+(owned?'':' lock');

    d.innerHTML=`<canvas width="120" height="120"></canvas><b style="color:${ch.t};text-shadow:0 0 .5em ${ch.t}">${ch.n}</b>`+
    (is?'<i class="badge">SELECIONADO</i>':owned?'<i class="ok">DISPONÍVEL</i>':`<span class="price" ${coins<ch.p?'data-no':''}>${ch.p} moedas</span><button class="buy">COMPRAR</button>`);

    icon(d.querySelector('canvas'), ch);

    d.onclick=()=> {
      if(owned) {
        sel=ch.id;
        save();
        renderChars()
      }
    };

    const b=d.querySelector('.buy');

    if(b)b.onclick=e=> {
      e.stopPropagation();
      if(coins<ch.p) {
        toast('Moedas insuficientes: faltam '+(ch.p-coins));
        return
      }

      coins-=ch.p;
      own.push(ch.id);
      save();
      renderChars();
      toast(ch.n+' desbloqueado!')
    };

    grid.append(d)
    });

  const c=cur();
  icon($('#pcube'), c);
  const n=$('#pname');
  n.textContent=c.n;
  n.style.color=c.t
}
const cv=$('#cv'), g=cv.getContext('2d'), W=960, H=540, T=48, GY=430, PX=230, GR=62, JV=17.5, AIR=2*JV/GR;

let spd=9, Q=st.get('q', 2), TH, run=false, last=0, acc=0, held=false, won=false, flash=0, L, P;

const IMG=["img/cidade-neon.jpg", "img/candy.jpg", "img/floresta.jpg", "img/mar.jpg", "img/por-do-sol.jpg", "img/gelo.jpg", "img/noite-escura.jpg", "img/galaxia.jpg", "img/vulcao.jpg"];

const ENVS=[
  {n:'CIDADE NEON', sky:['#0C0C17', '#1d1235', '#2E2040'], gf:'#14002e', acc:'#ff3fd0', sf:'#2a0a4d', blk:'#3b1670', bb:'#3fd8ff', sh:['r', '#1d0a40', '#ff3fd0'], pt:['#ff3fd0', 'up']},
  {n:'CANDY', sky:['#F5BDDB', '#f6b3da', '#e9bdd4'], gf:'#f08fc0', acc:'#ff4fa0', sf:'#ffffff', blk:'#ffc2e2', bb:'#ff4fa0', sh:['c', '#ffffff', ''], pt:['#ffd23d', 'dn']},
  {n:'FLORESTA', sky:['#123E10', '#1C4C18', '#224B17'], gf:'#0f2c0c', acc:'#9dff4f', sf:'#143d12', blk:'#5a3a1a', bb:'#c89a4a', sh:['r', '#0f2a0d', '#2f7d1c'], pt:['#e6ff7a', 'st']},
  {n:'MAR', sky:['#0D6091', '#085483', '#1B4B74'], gf:'#0a2f52', acc:'#6fe3ff', sf:'#06335c', blk:'#0b4f8a', bb:'#6fe3ff', sh:['c', '#0a3f6e', ''], pt:['#cdf6ff', 'up']},
  {n:'PÔR DO SOL', sky:['#DD7C4B', '#D9974C', '#B57740'], gf:'#8f5a2b', acc:'#ffe27a', sf:'#6b2a10', blk:'#b86a2f', bb:'#ffe27a', sh:['r', '#a8602b', '#ffcf6b'], pt:['#fff3c4', 'st'], big:'#fff3a0'},
  {n:'GELO', sky:['#A3C1D9', '#B2D2EB', '#B5D4ED'], gf:'#8fb3d1', acc:'#3fa0ff', sf:'#e8f6ff', blk:'#9fd0ff', bb:'#ffffff', sh:['t', '#cfe6f7', ''], pt:['#ffffff', 'dn']},
  {n:'NOITE ESCURA', sky:['#1D1838', '#2F2A4C', '#262533'], gf:'#17142a', acc:'#ffa63f', sf:'#1a1630', blk:'#4a4258', bb:'#ffa63f', sh:['r', '#14102a', '#ffa63f'], pt:['#ffd9a0', 'st'], big:'#e8e8ff'},
  {n:'GALÁXIA', sky:['#0B0B09', '#321C4A', '#2D2643'], gf:'#160a2e', acc:'#c34bff', sf:'#25104a', blk:'#2a1450', bb:'#c34bff', sh:['c', '#3a1a6a', ''], pt:['#ffffff', 'st']},
  {n:'VULCÃO', sky:['#400401', '#620A03', '#942F0C'], gf:'#2a0400', acc:'#ff5a1f', sf:'#1a0300', blk:'#3a0f08', bb:'#ff5a1f', sh:['t', '#2a0a05', ''], pt:['#ffa040', 'up']}];
ENVS.forEach((e, i)=>e.img=IMG[i]);
const BGS=["bg/cidade-neon.jpg", "bg/candy.jpg", "bg/floresta.jpg", "bg/mar.jpg", "bg/por-do-sol.jpg", "bg/gelo.jpg", "bg/noite-escura.jpg", "bg/galaxia.jpg", "bg/vulcao.jpg"];
const BG=BGS.map(s=>{const im=new Image();im.src=s;return im});
function bgDraw(){const im=BG[env];if(!im||!im.naturalWidth){deco();return}
 const w=1180,sc=P.x*T*.3,k=Math.floor(sc/w),off=-(sc-k*w);
 for(let j=0;j<3;j++){const x=off+j*w;g.save();if((k+j)&1){g.translate(x+w,0);g.scale(-1,1);g.drawImage(im,0,0,w,H)}else g.drawImage(im,x,0,w,H);g.restore()}}


function deco() {
  const k=P.x*T, tm=performance.now()/1e3, wr=(v, m)=>(v%m+m)%m, [ty, sc, tc]=TH.sh, [pc, pm]=TH.pt;

  if(TH.big) {
    g.fillStyle=TH.big;
    g.beginPath();
    g.arc(W*.72, 120, 70, 0, 7);
    g.fill()
  }

  for(let i=0;i<12;i++) {
    const x=wr(i*100-k*.25, 1200)-120, w=60+i%3*25, h=90+i*53%150;
    g.fillStyle=sc;

    if(ty=='r') {
      g.fillRect(x, GY-h, w, h);
      g.fillStyle=tc;
      g.fillRect(x, GY-h, w, 2)
    }
    else if(ty=='c') {
      g.globalAlpha=.7;
      g.beginPath();
      g.arc(x, GY-h*.9, w*.8, 0, 7);
      g.fill();
      g.globalAlpha=1
    }
    else {
      g.beginPath();
      g.moveTo(x-w, GY);
      g.lineTo(x, GY-h*1.1);
      g.lineTo(x+w, GY);
      g.fill()
    }
  }

  g.fillStyle=pc;
  for(let i=0;i<36;i++) {
    const sp=pm=='up'?-30:pm=='dn'?40:0;
    g.globalAlpha=.5+.5*Math.sin(tm*2+i);
    g.beginPath();
    g.arc(wr(i*83+Math.sin(tm+i)*10-k*.1, W), wr(i*57+tm*sp, GY), 1.5+i%3, 0, 7);
    g.fill()
  }
  g.globalAlpha=1
}

function gen(n, e) {
  const m=n+e*3;
  let s=(e*15+n)*9301+49297;
  const r=()=>(s=s*16807%2147483647)/2147483647, o=[], d=Math.min(1, (m-1)/14), sp=8.6+Math.min(m, 15)*.18+e*.3, len=90+n*18+e*10;
  let x=22;

  const R=(a, b)=>a+(r()*(b-a+1)|0), sw=(k, a)=> {
    for(let i=0;i<k;i++)o.push({t:'s', x:a+i, w:1})
  }, bl=(a, w, h)=>o.push({t:'b', x:a, w, h}), gap=()=>Math.max(2.4, 8-d*4.6-e*.1)*(.9+r()*.4);

  const PT=[[0, ()=> {
    const k=R(1, m>6?3:2);
    sw(k, x);
    return k
    }],
    [0, ()=> {
    const w=R(2, 3);
    bl(x, w, 1);
    return w
    }],
    [3, ()=> {
    sw(1, x);
    sw(1, x+2.6);
    return 3.6
    }],
    [4, ()=> {
    const w=R(2, 3);
    bl(x, w, 1);
    sw(R(1, 2), x+w);
    return w+2
    }],
    [5, ()=> {
    const w=R(2, 3+(m>9));
    o.push({t:'q', x, w});
    return w
    }],
    [7, ()=> {
    bl(x, 2, 1);
    bl(x+2, 2, 2);
    bl(x+4, 2, 1);
    sw(1, x+6);
    return 7
    }],
    [8, ()=> {
    o.push({t:'p', x, w:1});
    sw(4, x+2.2);
    return 6.2
    }],
    [9, ()=> {
    sw(1, x);
    sw(1, x+2.4);
    sw(1, x+4.8);
    return 5.8
    }],
    [11, ()=> {
    const w=R(2, 3);
    o.push({t:'q', x, w});
    sw(1, x+w+2.4);
    return w+3.4
    }],
    [12, ()=> {
    sw(1, x);
    bl(x+5, 2, 1);
    sw(2, x+8.5);
    return 10.5
    }], [16, ()=> {
    sw(4, x);
    return 4
    }]];

  while(x<len) {
    const ok=PT.filter(p=>m>=p[0]), w=ok[r()*ok.length|0][1]();
    x+=w+gap()
  }

  return{o, len:len+6, sp, th:ENVS[e]}
}

function reset() {
  P={x:0, y:0, vy:0, rot:0, on:true}
}

function start() {
  try{if(innerWidth<900&&!document.fullscreenElement){document.documentElement.requestFullscreen?.().then(()=>screen.orientation?.lock?.('landscape')).catch(()=>{})}}catch(e){}
  L=gen(lvl, env);
  spd=L.sp;
  TH=L.th;
  reset();
  won=false;
  $('#win').classList.remove('on');
  $('#lv').textContent=ENVS[env].n+' ('+lvl+'/15)';
  $('#co').textContent=coins;
  show('game')
}

function die() {
  flash=1;
  reset()
}
function step(dt) {

  P.x+=spd*dt;
  P.vy-=GR*dt;
  P.y+=P.vy*dt;
  let on=false, pd=0;

  if(P.y<=0) {
    if(!L.o.some(q=>q.t=='q'&&P.x>q.x+.15&&P.x<q.x+q.w-.15)&&P.y>-.4) {
      P.y=0;
      P.vy=0;
      on=true
    } else if(P.y<-3) {
      die();
      return
    }
  }

  for(const o of L.o) {
    if(o.x>P.x+2||o.x+o.w<P.x-2)continue;

    if(o.t=='s') {
      if(P.x+.4>o.x+.2&&P.x-.4<o.x+.8&&P.y+.1<.55) {
        die();
        return
      }
    }
    else if(o.t=='b') {
      if(P.x+.4>o.x&&P.x-.4<o.x+o.w) {
        if(P.vy<=0&&P.y>=o.h-.35&&P.y<=o.h+.05) {
          P.y=o.h;
          P.vy=0;
          on=true
        } else if(P.y+.1<o.h) {
          die();
          return
        }
      }
    } else if(o.t=='p') {
      if(P.x+.4>o.x&&P.x-.4<o.x+1&&P.y<.4&&P.vy<=0)pd=1
    }
  }

  if(on&&held) {
    P.vy=JV;
    on=false
  }
  if(pd) {
    P.vy=JV*1.5;
    on=false
  }

  P.on=on;

  if(!on)P.rot+=Math.PI/AIR*dt;
  else {
    const t=Math.round(P.rot/(Math.PI/2))*Math.PI/2;
    P.rot+=(t-P.rot)*Math.min(1, dt*28)
  }

  if(P.x>L.len)win()
}

function win() {
  won=true;
  const id=lid(env, lvl), first=!done.includes(id);

  if(first) {
    done.push(id);
    coins+=20
  }

  $('#reward').textContent=first?'+20 moedas':'Já concluído';
  let wt='NÍVEL COMPLETO', nx='PRÓXIMO NÍVEL';
  if(lvl>=15) {
    wt=env<8?'AMBIENTE LIBERADO: '+ENVS[env+1].n:'JOGO ZERADO!';
    nx='AMBIENTES'
  } else lvl++;
  $('#wt').textContent=wt;
  $('#next').textContent=nx;
  save();
  $('#co').textContent=coins;
  $('#win').classList.add('on')
}

function sx(x) {
  return(x-P.x)*T+PX
}

function render() {

  const bg=g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, TH.sky[0]);
  bg.addColorStop(.7, TH.sky[1]);
  bg.addColorStop(1, TH.sky[2]);
  g.fillStyle=bg;
  g.fillRect(0, 0, W, H);
  bgDraw();

  g.fillStyle=TH.gf;
  g.fillRect(0, GY, W, H-GY);
  g.strokeStyle=TH.acc+'88';
  g.lineWidth=1.5;

  for(let i=-24;i<24;i++) {
    const xg=sx(Math.floor(P.x/2)*2+i*2);
    g.beginPath();
    g.moveTo(xg, GY);
    g.lineTo(W/2+(xg-W/2)*3.2, H);
    g.stroke()
  }

  for(let j=1;j<5;j++) {
    const y=GY+(H-GY)*(j/5)**1.6;
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(W, y);
    g.stroke()
  }

  g.shadowColor=TH.acc;
  g.shadowBlur=Q*7;
  g.strokeStyle=TH.acc;
  g.lineWidth=3;
  g.beginPath();
  g.moveTo(0, GY);
  g.lineTo(W, GY);
  g.stroke();

  for(const o of L.o) {
    const x=sx(o.x);
    if(x>W+10||x+o.w*T<-10)continue;

    if(o.t=='q') {
      g.fillStyle='#07001a';
      g.fillRect(x, GY-3, o.w*T, H);
      g.strokeStyle=TH.acc;
      g.beginPath();
      g.moveTo(x, GY);
      g.lineTo(x, H);
      g.moveTo(x+o.w*T, GY);
      g.lineTo(x+o.w*T, H);
      g.stroke()
    } else if(o.t=='p') {
      g.fillStyle='#ffe066';
      g.shadowColor='#ffe066';
      g.fillRect(x+6, GY-9, T-12, 9)
    } else if(o.t=='s') {
      g.fillStyle=TH.sf;
      g.strokeStyle=TH.acc;
      g.beginPath();
      g.moveTo(x+4, GY);
      g.lineTo(x+T/2, GY-T*.8);
      g.lineTo(x+T-4, GY);
      g.closePath();
      g.fill();
      g.stroke()
    }
    else {
      g.fillStyle=TH.blk;
      g.strokeStyle=TH.bb;
      g.shadowColor=TH.bb;
      g.beginPath();
      g.roundRect(x, GY-T*o.h, o.w*T, T*o.h, 6);
      g.fill();
      g.stroke()
    }
  }

  g.shadowBlur=0;
  g.save();
  g.translate(PX, GY-(P.y+.5)*T);
  g.rotate(P.rot);
  drawCube(g, cur(), T);
  g.restore();

  g.strokeStyle='#ffe066';
  g.shadowColor='#ffe066';
  g.shadowBlur=14;
  g.lineWidth=4;
  const fx=sx(L.len);
  g.beginPath();
  g.moveTo(fx, 0);
  g.lineTo(fx, GY);
  g.stroke();
  g.shadowBlur=0;

  if(flash>0) {
    g.fillStyle=`rgba(255,63,208,${flash*.45})`;
    g.fillRect(0, 0, W, H);
    flash-=.06
  }

  $('#bar i').style.width=Math.min(100, P.x/L.len*100)+'%'
}

function loop(t) {
  if(!run)return;
  const dt=Math.min(.05, (t-last)/1000);
  last=t;

  if(!won) {
    acc+=dt;
    while(acc>=1/120) {
      step(1/120);
      acc-=1/120;
      if(won)break
    }
  }
  render();
  requestAnimationFrame(loop)
}
const down=e=> {
  if(run) {
    held=true;
    e.preventDefault?.()
  }
}, up=()=> {
  held=false
};
addEventListener('keydown', e=> {
  if(['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
    if(run)e.preventDefault();
    held=true
  }
  if(e.code==='Escape'&&run)show('menu')
  });
addEventListener('keyup', e=> {
  if(['Space', 'ArrowUp', 'KeyW'].includes(e.code))held=false
  });
$('#game').addEventListener('pointerdown', e=> {
  if(!e.target.closest('button'))down(e)
  });addEventListener('pointerup', up);addEventListener('pointercancel', up);
$('#play').onclick=start;$('#goChars').onclick=()=>show('chars');$('#back').onclick=()=>show('menu');
$('#next').onclick=()=> {
  $('#next').textContent=='AMBIENTES'?show('envs'):start()
};

function renderLevels() {
  const e=$('#lgrid');
  e.innerHTML='';
  $('#lvt').textContent=ENVS[env].n;
  for(let n=1;n<=15;n++) {
    const id=lid(env, n), b=document.createElement('button');
    b.className='lvb'+(done.includes(id)?' done':'');
    b.disabled=!(LIBERAR_NIVEIS||n==1||done.includes(id-1));
    b.innerHTML=n+'<small>'+(n<4?'FÁCIL':n<8?'MÉDIO':n<12?'DIFÍCIL':'EXTREMO')+'</small>';
    b.onclick=()=> {
      lvl=n;
      start()
    };
    e.append(b)
  }
}

function renderEnvs() {
  const e=$('#egrid');
  e.innerHTML='';
  ENVS.forEach((v, i)=> {
    const ok=envOpen(i), b=document.createElement('button');
    b.className='ecard'+(ok?'':' lock');
    b.innerHTML=`<img src="${v.img}" alt=""><span>${v.n}<em style="font-style:normal;color:var(--gold)">${envDone(i)}/15</em></span>`+(ok?'':`<b>BLOQUEADO: complete ${ENVS[i-1].n}</b>`);
    b.onclick=()=> {
      if(!ok) {
        toast('Complete os 15 níveis de '+ENVS[i-1].n);
        return
      }
      env=i;
      show('levels')
    };
    e.append(b)
    })
}

function renderCfg() {
  document.querySelectorAll('[data-q]').forEach(b=>b.classList.toggle('on', +b.dataset.q===Q));
  $('#fs').textContent=document.fullscreenElement?'DESLIGAR':'LIGAR'
}

document.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=> {
  Q=+b.dataset.q;
  st.set('q', Q);
  renderCfg()
  });
$('#fs').onclick=()=> {
  try {
    document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()
  } catch(e) {

  }
  setTimeout(renderCfg, 300)
};
$('#rs').onclick=()=> {
  const b=$('#rs');
  if(b.dataset.c) {
    coins=0;
    sel='roxo';
    own=['roxo'];
    done=[];
    lvl=1;
    env=0;
    save();
    delete b.dataset.c;
    b.textContent='ZERAR';
    toast('Progresso zerado')
  } else {
    b.dataset.c=1;
    b.textContent='CONFIRMAR?'
  }
};
$('#goLv').onclick=()=>show('envs');$('#b4').onclick=()=>show('menu');$('#goCfg').onclick=()=>show('cfg');$('#b2').onclick=()=>show('envs');$('#b3').onclick=()=>show('menu');$('#home').onclick=()=>show('menu');
renderMenu();