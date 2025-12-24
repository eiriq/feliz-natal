const elementoDigitacao = document.getElementById('texto-digitado');
const wrapperBotaoIniciar = document.getElementById('wrapper-botao-iniciar');
const botaoIniciar = document.getElementById('botao-iniciar');
const wrapperBotaoGaleria = document.getElementById('wrapper-botao-galeria');
const botaoIrGaleria = document.getElementById('botao-ir-galeria');

const secaoIntro = document.getElementById('secao-intro');
const secaoGaleria = document.getElementById('secao-galeria');
const gridGaleria = document.getElementById('grid-galeria');
const wrapperPlayerMusica = document.getElementById('wrapper-player-musica');

const audioForYou = document.getElementById('audio-foryou');
const audioSensational = document.getElementById('audio-sensational');

const widgetGaleria = document.getElementById('widget-musica-galeria');
const galeriaBtnPlayPause = document.getElementById('galeria-btn-play-pause');
const galeriaVolume = document.getElementById('galeria-volume');

const lightboxFotos = document.getElementById('lightbox-fotos');
const alvoLightbox = document.getElementById('alvo-lightbox');
const botaoFecharLightbox = document.getElementById('botao-fechar-lightbox');

const barraProgresso = document.getElementById('barra-progresso');
const containerBarra = document.getElementById('container-barra');
const tempoAtual = document.getElementById('tempo-atual');
const tempoTotal = document.getElementById('tempo-total');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');
const visualizador = document.querySelector('.barras-sonoras');

const sliderVolume = document.getElementById('slider-volume');
const nivelVolume = document.getElementById('nivel-volume');
const pinoVolume = document.getElementById('pino-volume');

const texto1 = [
    "Olá, meu bem:)",
    "Posso te mostrar umas coisinhas?",
    "Hoje é véspera:) queria te lembrar uma retrospectiva legal:)",
    "Vamos ver juntos?"
];

const texto2 = "Eu espero que esse seja um bom natal pra voce e pra sua familia, quero te dizer uma coisa antes de mostrar tudo:)";

const texto3 = [
    "Agora, vamos ver alguns dos nossos momentos? :D",
    "Não tem todos infelizmente porque nao sao todos que eu achei aqui D:",
    "E não tem todo mundo pq eu so peguei os que aparecem so a gente:D",
    "",
    "espero que aproveite...",
    "",
    "Um feliz nata, e... eu sinto muito sua falta:)",
    "Me desculpe qualquer coisinha, posso ser dificil mas voce ainda sempre sera uma irma pra mim",
    "",
    "Chega de falar e vamos la!:D"
];

const arquivos = [
    '1.jpg', '2.jpg', '3.jpg', '4.webp', '5.webp', 
    '6.webp', '7.webp', '8.webp', '9.webp', '10.webp',
    '11.webp', '12.webp', '13.jpg', '14.webp', '15.jpg',
    'https://files.catbox.moe/ncp3nb.mp4',
    '17.png', '18.png', '19.png', '20.jpg',
    '21.jpg', '22.jpg', '23.jpg'
];


async function digitarTexto(texto, elemento, velocidade = 30, limpar = true) {
    if(limpar) elemento.innerHTML = '';
    elemento.classList.add('cursor-digitacao');
    
    if(Array.isArray(texto)) {
        for(let linha of texto) {
            const p = document.createElement('p');
            elemento.appendChild(p);
            for(let char of linha) {
                p.textContent += char;
                await new Promise(r => setTimeout(r, velocidade));
            }
            await new Promise(r => setTimeout(r, 500));
        }
    } else {
        for(let char of texto) {
            elemento.textContent += char;
            await new Promise(r => setTimeout(r, velocidade));
        }
    }
    elemento.classList.remove('cursor-digitacao');
}

function ativarTelaCheia() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Erro: ${err.message}`);
        });
    }
}

function iniciarNeve() {
    const container = document.getElementById('snow-container');
    const numeroFlocos = 25; 
    
    for (let i = 0; i < numeroFlocos; i++) {
        const floco = document.createElement('div');
        floco.classList.add('snowflake');
        floco.innerHTML = '❄';
        
        floco.style.left = Math.random() * 100 + 'vw';
        
        const tamanho = Math.random() * 10 + 10 + 'px';
        floco.style.fontSize = tamanho;
        
        const duracao = Math.random() * 5 + 5 + 's';
        floco.style.animationDuration = duracao;
        
        floco.style.animationDelay = Math.random() * 5 + 's';
        
        floco.style.opacity = Math.random() * 0.5 + 0.3;
        
        container.appendChild(floco);
    }
}

function abrirModalAnimado(dialogElemento) {
    dialogElemento.showModal();
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            dialogElemento.classList.add('dialog-animado');
        });
    });
}

function fecharModalAnimado(dialogElemento) {
    dialogElemento.classList.remove('dialog-animado');
    setTimeout(() => {
        dialogElemento.close();
    }, 300);
}

window.addEventListener('DOMContentLoaded', async () => {
    await digitarTexto(texto1, elementoDigitacao);
    wrapperBotaoIniciar.style.opacity = '1';
    
    botaoIniciar.addEventListener('click', function() {
        iniciarFluxoPlayer();
    });
});

function iniciarFluxoPlayer() {
    botaoIniciar.classList.add('ativo');
    
    setTimeout(() => {
        ativarTelaCheia();
        wrapperBotaoIniciar.style.display = 'none';
        digitarTexto([texto2], elementoDigitacao).then(() => {
            wrapperPlayerMusica.style.display = 'block';
            configurarPlayer();
        });
    }, 600);
}

function atualizarTempoTotal() {
    if (audioForYou.duration && !isNaN(audioForYou.duration)) {
        tempoTotal.textContent = formatarTempo(audioForYou.duration);
    }
}

function configurarPlayer() {
    audioForYou.load();
    btnPlay.style.display = 'block';
    btnPause.style.display = 'none';

    btnPlay.addEventListener('click', alternarPlay);
    btnPause.addEventListener('click', alternarPlay);

    audioForYou.addEventListener('loadedmetadata', atualizarTempoTotal);
    audioForYou.addEventListener('canplay', atualizarTempoTotal);
    audioForYou.addEventListener('timeupdate', () => {
        atualizarProgresso();
        if (tempoTotal.textContent === "0:00") {
            atualizarTempoTotal();
        }
    });
    
    sliderVolume.addEventListener('click', ajustarVolume);

    audioForYou.onended = function() {
        wrapperPlayerMusica.classList.add('sumir-com-fade');
        
        setTimeout(() => {
            wrapperPlayerMusica.style.display = 'none';
            wrapperBotaoGaleria.style.display = 'flex';
            
            digitarTexto(texto3, elementoDigitacao, 70).then(() => {
                wrapperBotaoGaleria.style.opacity = '1';
                wrapperBotaoGaleria.style.pointerEvents = 'auto';
                
                botaoIrGaleria.onclick = function() {
                    botaoIrGaleria.classList.add('ativo');
                    setTimeout(() => {
                        irParaGaleria();
                    }, 600);
                };
            });
        }, 800);
    };
}

function alternarPlay() {
    if (audioForYou.paused) {
        audioForYou.play();
        btnPlay.style.display = 'none';
        btnPause.style.display = 'block';
        visualizador.classList.remove('pausado');
    } else {
        audioForYou.pause();
        btnPlay.style.display = 'block';
        btnPause.style.display = 'none';
        visualizador.classList.add('pausado');
    }
}

function atualizarProgresso() {
    const { duration, currentTime } = audioForYou;
    if(isNaN(duration)) return;
    
    const porcentagem = (currentTime / duration) * 100;
    barraProgresso.style.width = `${porcentagem}%`;
    tempoAtual.textContent = formatarTempo(currentTime);
}

function formatarTempo(segundos) {
    if(!isFinite(segundos)) return "0:00";
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function ajustarVolume(e) {
    const largura = sliderVolume.clientWidth;
    const clickX = e.offsetX;
    let volume = clickX / largura;
    
    if (volume > 1) volume = 1;
    if (volume < 0) volume = 0;
    
    audioForYou.volume = volume;
    
    const porcentagem = volume * 100;
    nivelVolume.style.width = `${porcentagem}%`;
    pinoVolume.style.right = `${100 - porcentagem}%`;
}

containerBarra.addEventListener('click', (e) => {
    const largura = containerBarra.clientWidth;
    const clickX = e.offsetX;
    const duracao = audioForYou.duration;
    if(isNaN(duracao)) return;
    
    audioForYou.currentTime = (clickX / largura) * duracao;
});

function irParaGaleria() {
    secaoIntro.style.display = 'none';
    secaoGaleria.style.display = 'block';
    
    iniciarNeve(); 

    audioSensational.volume = 0.5;
    audioSensational.play().catch(e => console.log("Erro sensational:", e));
    atualizarIconeGaleria(true);

    galeriaVolume.value = 0.5;
    galeriaVolume.addEventListener('input', (e) => {
        audioSensational.volume = e.target.value;
    });

    galeriaBtnPlayPause.addEventListener('click', () => {
        if(audioSensational.paused) {
            audioSensational.play();
            atualizarIconeGaleria(true);
        } else {
            audioSensational.pause();
            atualizarIconeGaleria(false);
        }
    });

    iniciarGaleria();
}

function atualizarIconeGaleria(tocando) {
    galeriaBtnPlayPause.innerHTML = tocando 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icone-p"><path d="M6 4h4v16h-4zM14 4h4v16h-4z"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="icone-p"><path d="M3 22v-20l18 10-18 10z"></path></svg>';
}

function iniciarGaleria() {
    arquivos.forEach((arquivo, index) => {
        const card = document.createElement('div');
        card.className = 'card-midia';
        card.style.animationDelay = `${index * 0.05}s`;

        const ehVideo = arquivo.endsWith('.mp4') || arquivo.includes('drive.google.com');
        const src = arquivo.startsWith('http') ? arquivo : `Imagens/${arquivo}`;

        const overlay = document.createElement('div');
        overlay.className = 'overlay-card';

        if (ehVideo) {
            const vid = document.createElement('video');
            vid.src = src;
            card.appendChild(vid);
            
            const icone = document.createElement('div');
            icone.className = 'video-indicator';
            icone.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
            card.appendChild(icone);
            
            const label = document.createElement('span');
            label.style.color = 'white';
            label.style.fontWeight = '500';
            label.textContent = 'Vídeo';
            overlay.appendChild(label);
        } else {
            const img = document.createElement('img');
            img.src = src;
            card.appendChild(img);
            
            const label = document.createElement('span');
            label.style.color = 'white';
            label.style.fontWeight = '500';
            label.textContent = 'Foto';
            overlay.appendChild(label);
        }
        
        card.appendChild(overlay);

        card.addEventListener('click', () => abrirLightbox(src, ehVideo));
        gridGaleria.appendChild(card);
    });
}

function abrirLightbox(src, ehVideo) {
    alvoLightbox.innerHTML = '';
    
    if(ehVideo) {
        audioSensational.pause();
        atualizarIconeGaleria(false);

        if(src.includes('drive.google.com')) {
            const iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.className = 'midia-lightbox';
            iframe.allow = 'autoplay';
            iframe.style.border = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            alvoLightbox.appendChild(iframe);
        } else {
            const vid = document.createElement('video');
            vid.src = src;
            vid.controls = true;
            vid.autoplay = true;
            vid.className = 'midia-lightbox';
            alvoLightbox.appendChild(vid);
            
            vid.onended = () => {
                audioSensational.play();
                atualizarIconeGaleria(true);
            };
        }
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'midia-lightbox';
        alvoLightbox.appendChild(img);
    }
    abrirModalAnimado(lightboxFotos);
}

function fecharLightbox() {
    const video = alvoLightbox.querySelector('video');
    if(video) {
        video.pause();
        video.src = "";
    }
    fecharModalAnimado(lightboxFotos);
    alvoLightbox.innerHTML = '';
}

botaoFecharLightbox.addEventListener('click', fecharLightbox);

lightboxFotos.addEventListener('click', (e) => {
    if (e.target === lightboxFotos) {
        fecharLightbox();
    }
});

const modalRepositorio = document.getElementById('modal-repositorio');
const modalDiversao = document.getElementById('modal-diversao');

document.getElementById('btn-repositorio').addEventListener('click', () => abrirModalAnimado(modalRepositorio));
document.getElementById('btn-diversao').addEventListener('click', () => abrirModalAnimado(modalDiversao));

document.getElementById('fechar-repo').addEventListener('click', () => fecharModalAnimado(modalRepositorio));
document.getElementById('fechar-diversao').addEventListener('click', () => fecharModalAnimado(modalDiversao));

document.getElementById('ir-repo').addEventListener('click', () => {
    window.location.href = "https://github.com/DimitrisMilonopoulos/mitsugen";
});

document.getElementById('ir-diversao').addEventListener('click', () => {
    window.location.href = "Jogos/jogos.html";
});
