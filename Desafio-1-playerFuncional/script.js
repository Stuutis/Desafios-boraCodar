document.addEventListener('DOMContentLoaded', function () {
    let nomeArquivos; // armazenar nome das musicas
    let index = 0; // musicas armazenadas em um array e vamos começar por indice 0

    // URL da pasta "music"
    const pastaMusicaUrl = './music/';

    // Selecionar o elemento com a classe 'music'
    const musicName = document.querySelectorAll('.music');

    // Selecionar o elemento de áudio
    const audioPlayer = document.getElementById('audioPlayer');

    // Selecionar todos os elementos com a classe 'playStop'
    const playStopButtons = document.querySelectorAll('.playStop');

    // seleciona a track e a progress bar
    const progressBar = document.querySelectorAll('.track .progress-bar');

    // Selecionamos os tempos atuais e totais da musica
    const currentTimeElements = document.querySelectorAll('.last-time');
    const totalTimeElements = document.querySelectorAll('.total-time');

    // Função para carregar e reproduzir uma música
    async function loadAndPlayMusic(musicName) {
        const musicUrl = `${pastaMusicaUrl}${musicName}.mp3`;
        audioPlayer.src = musicUrl;
        await audioPlayer.load(); // Esperar o áudio carregar
        audioPlayer.currentTime = 0; // Reiniciar a música atual
        audioPlayer.play(); // Iniciar a música automaticamente
    }

    // Função para atualizar o nome da música
    function updateMusicName(musicNames, index) {
        if (musicNames.length > 0 && index >= 0 && index < musicNames.length) {
            musicName.forEach((element) => {
                element.textContent = musicNames[index];
            });
        }
    }

    // Função para obter a lista de arquivos de música
    async function fetchMusicFiles() {
        try {
            const response = await fetch(pastaMusicaUrl);
            const data = await response.text();
            // Extrai os nomes dos arquivos da resposta
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(data, 'text/html');
            const links = htmlDocument.querySelectorAll('a');

            return Array.from(links)
                .map(link => {
                    const url = new URL(link.href);
                    const nomeCompleto = decodeURIComponent(url.pathname.split('/').pop());
                    const nomeArquivo = nomeCompleto.replace('.mp3', '');
                    return nomeArquivo;
                })
                .filter(nomeArquivo => nomeArquivo.trim() !== '');
        } catch (error) {
            throw new Error('Erro ao obter a lista de arquivos: ' + error.message);
        }
    }

    // Evento clique no botão next
    async function nextMusic() {
        index++;
        if (index >= nomeArquivos.length) {
            index = 0; // Voltar para a primeira música caso chegue ao final da lista
        }

        audioPlayer.pause(); // Pausar o áudio antes de começar a próxima música
        await loadAndPlayMusic(nomeArquivos[index]);
        updateMusicName(nomeArquivos, index);
    }

    // Evento clique no botão prev
    async function prevMusic() {
        index--;
        if (index < 0) {
            index = nomeArquivos.length - 1; // Voltar para a última música caso esteja na primeira
        }

        audioPlayer.pause(); // Pausar o áudio antes de começar a música anterior
        await loadAndPlayMusic(nomeArquivos[index]);
        updateMusicName(nomeArquivos, index);
    }

    // Faz solicitação para obter a lista dos arquivos na pasta music
    fetchMusicFiles()
        .then((musicNames) => {
            nomeArquivos = musicNames;
            if (musicNames.length > 0) {
                updateMusicName(musicNames, 0);
            }

            // Adicionar o evento de clique a cada botão 'playStop'
            playStopButtons.forEach((div) => {
                div.addEventListener('click', () => {
                    // Verificar se o áudio está pausado ou em reprodução
                    if (audioPlayer.paused) {
                        // Se estiver pausado, reproduzir o áudio
                        audioPlayer.play();
                        div.classList.add('playing');
                    } else {
                        // Se estiver em reprodução, pausar o áudio
                        audioPlayer.pause();
                        div.classList.remove('playing');
                    }
                });
            });
        })
        .catch(error => {
            console.error(error);
        });

    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = formatTime(audioPlayer.currentTime);
        const totalTime = formatTime(audioPlayer.duration);

        currentTimeElements.forEach((element) => {
            element.textContent = currentTime;
        });

        totalTimeElements.forEach((element) => {
            element.textContent = totalTime;
        });

        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;

        // Iterar sobre cada elemento .progress-bar e definir a width deles
        progressBar.forEach((bar) => {
            bar.style.width = `${progress}%`;
        });
    });

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${padZero(minutes)}:${padZero(seconds)}`;
    }

    function padZero(number) {
        return number < 10 ? `0${number}` : number;
    }

    // Atualizar tempo total
    function updateTotalTime() {
        const totalTime = formatTime(audioPlayer.duration);

        totalTimeElements.forEach((element) => {
            element.textContent = totalTime;
        });
    }

    // Chamar a função para atualizar o tempo total assim que o áudio for carregado
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);

    // Atualizar o tempo total assim que a página for carregada
    updateTotalTime();

    // Evento clique no botão next
    const nextButtons = document.querySelectorAll('.next');
    nextButtons.forEach((nextButton) => {
        nextButton.addEventListener('click', nextMusic);
    });

    // Evento clique no botão prev
    const prevButtons = document.querySelectorAll('.previus');
    prevButtons.forEach((prevButton) => {
        prevButton.addEventListener('click', prevMusic);
    });
});