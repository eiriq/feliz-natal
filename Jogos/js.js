const abas = document.querySelectorAll('.aba-jogos');
const paineis = document.querySelectorAll('.painel-jogo');

abas.forEach(aba => {
    aba.addEventListener('click', () => {
        abas.forEach(a => a.classList.remove('ativo'));
        paineis.forEach(p => p.classList.remove('visivel'));
        
        aba.classList.add('ativo');
        const alvo = aba.dataset.alvo;
        document.getElementById(alvo).classList.add('visivel');
    });
});

const neveContainer = document.getElementById('snow-container');
for(let i=0; i<30; i++) {
    const floco = document.createElement('div');
    floco.classList.add('snowflake');
    floco.innerHTML = '❄';
    floco.style.left = Math.random() * 100 + 'vw';
    floco.style.animationDuration = (Math.random() * 5 + 5) + 's';
    floco.style.animationDelay = Math.random() * 5 + 's';
    neveContainer.appendChild(floco);
}

function ativarTelaCheia() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log("Autoplay/Fullscreen bloqueado até interação do usuário.");
        });
    }
}

window.addEventListener('DOMContentLoaded', ativarTelaCheia);

const habilitarFullscreenUmaVez = () => {
    ativarTelaCheia();
    document.body.removeEventListener('click', habilitarFullscreenUmaVez);
    document.body.removeEventListener('touchstart', habilitarFullscreenUmaVez);
};
document.body.addEventListener('click', habilitarFullscreenUmaVez);
document.body.addEventListener('touchstart', habilitarFullscreenUmaVez);


const iconesMemoria = ['🎄', '🎅', '🎁', '❄️', '⭐', '🦌', '🧦', '🔔'];
let cartasMemoria = [...iconesMemoria, ...iconesMemoria];
const gridMemoria = document.getElementById('grid-memoria');
let cartaVirada = null;
let bloquearTabuleiro = false;
let movimentos = 0;
const textoMovimentos = document.getElementById('movimentos-memoria');

function criarJogoMemoria() {
    gridMemoria.innerHTML = '';
    cartasMemoria.sort(() => 0.5 - Math.random());
    
    cartasMemoria.forEach(icone => {
        const carta = document.createElement('div');
        carta.classList.add('carta-memoria');
        carta.innerHTML = `
            <div class="frente-carta">?</div>
            <div class="verso-carta">${icone}</div>
        `;
        carta.addEventListener('click', virarCarta);
        gridMemoria.appendChild(carta);
    });
    movimentos = 0;
    textoMovimentos.innerText = 'Movimentos: 0';
}

function virarCarta() {
    if (bloquearTabuleiro) return;
    if (this === cartaVirada) return;
    
    this.classList.add('virada');
    
    if (!cartaVirada) {
        cartaVirada = this;
        return;
    }
    
    conferirSegundaCarta(this);
}

function conferirSegundaCarta(cartaSegunda) {
    bloquearTabuleiro = true;
    const icone1 = cartaVirada.querySelector('.verso-carta').textContent;
    const icone2 = cartaSegunda.querySelector('.verso-carta').textContent;
    
    if (icone1 === icone2) {
        desativarCartas();
    } else {
        desvirarCartas(cartaSegunda);
    }
    movimentos++;
    textoMovimentos.innerText = `Movimentos: ${movimentos}`;
}

function desativarCartas() {
    cartaVirada.removeEventListener('click', virarCarta);
    cartaSegunda.removeEventListener('click', virarCarta);
    cartaVirada = null;
    cartaSegunda = null;
    bloquearTabuleiro = false;
}

function desvirarCartas(cartaSegunda) {
    setTimeout(() => {
        cartaVirada.classList.remove('virada');
        cartaSegunda.classList.remove('virada');
        cartaVirada = null;
        cartaSegunda = null;
        bloquearTabuleiro = false;
    }, 1000);
}

document.getElementById('reiniciar-memoria').addEventListener('click', criarJogoMemoria);
criarJogoMemoria();

const canvas = document.getElementById('canvas-cobrinha');
const ctx = canvas.getContext('2d');
const grade = 20;
let cobra = [{x: 10, y: 10}];
let comida = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let intervaloJogo;
let pontos = 0;
const textoPontosCobrinha = document.getElementById('pontos-cobrinha');
const botaoIniciarCobrinha = document.getElementById('iniciar-cobrinha');

function desenharCobrinha() {
    ctx.fillStyle = '#33050f'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    cobra.forEach((parte, index) => {
        ctx.fillStyle = index === 0 ? '#22a575' : '#c23e5e'; 
        ctx.fillRect(parte.x * grade, parte.y * grade, grade - 2, grade - 2);
    });
    
    ctx.fillStyle = '#ffb4ba';
    ctx.beginPath();
    let comidaX = comida.x * grade + grade/2;
    let comidaY = comida.y * grade + grade/2;
    ctx.arc(comidaX, comidaY, grade/2 - 2, 0, 2 * Math.PI);
    ctx.fill();
}

function moverCobrinha() {
    const cabeca = {x: cobra[0].x + dx, y: cobra[0].y + dy};
    
    if (cabeca.x < 0 || cabeca.x >= canvas.width/grade || cabeca.y < 0 || cabeca.y >= canvas.height/grade || cobra.some(p => p.x === cabeca.x && p.y === cabeca.y)) {
        clearInterval(intervaloJogo);
        alert('Fim de Jogo! Pontos: ' + pontos);
        botaoIniciarCobrinha.style.display = 'inline-block';
        return;
    }
    
    cobra.unshift(cabeca);
    
    if (cabeca.x === comida.x && cabeca.y === comida.y) {
        pontos++;
        textoPontosCobrinha.innerText = 'Pontos: ' + pontos;
        comida.x = Math.floor(Math.random() * (canvas.width/grade));
        comida.y = Math.floor(Math.random() * (canvas.height/grade));
    } else {
        cobra.pop();
    }
}

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if(e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if(e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if(e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
});

document.getElementById('btn-cima').onclick = () => { if(dy === 0) { dx = 0; dy = -1; } };
document.getElementById('btn-baixo').onclick = () => { if(dy === 0) { dx = 0; dy = 1; } };
document.getElementById('btn-esquerda').onclick = () => { if(dx === 0) { dx = -1; dy = 0; } };
document.getElementById('btn-direita').onclick = () => { if(dx === 0) { dx = 1; dy = 0; } };

function iniciarCobrinha() {
    cobra = [{x: 10, y: 10}];
    dx = 1;
    dy = 0;
    pontos = 0;
    textoPontosCobrinha.innerText = 'Pontos: 0';
    botaoIniciarCobrinha.style.display = 'none';
    clearInterval(intervaloJogo);
    intervaloJogo = setInterval(() => {
        moverCobrinha();
        desenharCobrinha();
    }, 100);
}

botaoIniciarCobrinha.addEventListener('click', iniciarCobrinha);

const areaPresentes = document.getElementById('area-presentes');
const treno = document.getElementById('treno');
const textoPontosPresentes = document.getElementById('pontos-presentes');
const botaoIniciarPresentes = document.getElementById('iniciar-presentes');

let presentes = [];
let pontosPresentes = 0;
let posicaoTreno = 50;
let loopPresentes;
let velocidade = 3;

function criarPresente() {
    const presente = document.createElement('div');
    presente.classList.add('presente');
    presente.innerText = ['🎁', '🧸', '🍬'][Math.floor(Math.random() * 3)];
    presente.style.left = Math.random() * (areaPresentes.clientWidth - 40) + 'px';
    presente.style.top = '-50px';
    areaPresentes.appendChild(presente);
    presentes.push(presente);
}

function moverPresentes() {
    presentes.forEach((p, index) => {
        let atual = parseInt(p.style.top || '-50');
        atual += velocidade;
        p.style.top = atual + 'px';
        
        const pRect = p.getBoundingClientRect();
        const tRect = treno.getBoundingClientRect();
        
        if (pRect.bottom > tRect.top && pRect.left < tRect.right && pRect.right > tRect.left) {
            p.remove();
            presentes.splice(index, 1);
            pontosPresentes += 10;
            textoPontosPresentes.innerText = 'Presentes: ' + pontosPresentes;
        }
        
        if (atual > areaPresentes.clientHeight) {
            p.remove();
            presentes.splice(index, 1);
        }
    });
}

function loopJogoPresentes() {
    if (Math.random() < 0.03) criarPresente();
    moverPresentes();
    loopPresentes = requestAnimationFrame(loopJogoPresentes);
}

function iniciarPresentes() {
    presentes.forEach(p => p.remove());
    presentes = [];
    pontosPresentes = 0;
    textoPontosPresentes.innerText = 'Presentes: 0';
    posicaoTreno = 50;
    treno.style.left = '50%';
    botaoIniciarPresentes.style.display = 'none';
    cancelAnimationFrame(loopPresentes);
    loopJogoPresentes();
}

areaPresentes.addEventListener('mousemove', (e) => {
    const rect = areaPresentes.getBoundingClientRect();
    posicaoTreno = ((e.clientX - rect.left) / rect.width) * 100;
    posicaoTreno = Math.max(10, Math.min(90, posicaoTreno));
    treno.style.left = posicaoTreno + '%';
});

areaPresentes.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = areaPresentes.getBoundingClientRect();
    posicaoTreno = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    posicaoTreno = Math.max(10, Math.min(90, posicaoTreno));
    treno.style.left = posicaoTreno + '%';
});

document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft') posicaoTreno = Math.max(10, posicaoTreno - 5);
    if(e.key === 'ArrowRight') posicaoTreno = Math.min(90, posicaoTreno + 5);
    treno.style.left = posicaoTreno + '%';
});

botaoIniciarPresentes.addEventListener('click', iniciarPresentes);
