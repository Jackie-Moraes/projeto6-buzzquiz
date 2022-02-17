// Constante Global - API

const BUZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";

// Variáveis Globais - Gerais
let Quizzes= [];
let gradient = "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%)"


// Variáveis Globais - Criação de Quizz

let quizzTitle = "";
let quizzUrl = "";
let quizzQuestions = 0;
let quizzLevels = 0;
let questionsTitle = [];
let questionsColor = [];
let questionsAnswer = [];
let questionsURL = [];
let levelsTitle = [];
let levelsURL = [];
let levelsDesc = [];
let levelsPercent = [];


// Função para receber quizzes da API
function getQuizzes(){
    const request = axios.get(BUZZ_API);
    request.then(CarregarQuizzes);
    request.catch();
}

// Função para carregar os Quizzes no array
function CarregarQuizzes(message){
    Quizzes = message.data;
    console.log(Quizzes);
    MostrarQuizzes();
}

// Função para mostrar os Quizzes na tela 
function MostrarQuizzes(){
    const AllQuizzes = document.querySelector('.other-quizzes');
    AllQuizzes.innerHTML = "<h2>Todos os Quizzes</h2>";
    let selecionarImagem = null;
    for(contador=0;contador<Quizzes.length;contador++){
        const id = Quizzes[contador].id;

        AllQuizzes.innerHTML += `
        <div class="box" id="${id}" onclick = "GetQuizz(${id})">
            <div class="title">
                <span>${Quizzes[contador].title}</span>
            </div>
        </div>`

        selecionarImagem = document.getElementById(`${id}`);
        selecionarImagem.style.setProperty("background-image", `${gradient}, url('${Quizzes[contador].image}')`);
    }
}

//Função para pegar o Quizz clicado da API
function GetQuizz(Id){
    const request = axios.get(BUZZ_API +Id); 
    request.then(EnterQuizz); 
} 
    
//Função para colocar o quizz na tela
function EnterQuizz(message){ 
    QuizzSelecionado = message.data;
    document.querySelector('.main-page').classList.add('hidden');
    const QuizzPage = document.querySelector('.quizz-answering');
    QuizzPage.querySelector('.header-quizz').scrollIntoView();
    QuizzPage.classList.remove('hidden');
    QuizzPage.innerHTML = `
    <div class="header-quizz">
        <h2 class="header-title">
        </h2>
    </div>`;
    // Coloca a Imagem e Titulo do Quizz na header da página
    const QuizzHeader = QuizzPage.querySelector('.header-quizz');
    QuizzHeader.style.setProperty("background-image", `${gradient}, url('${QuizzSelecionado.image}')`);
    QuizzHeader.querySelector('.header-title').innerHTML = QuizzSelecionado.title;

    const Questions = QuizzSelecionado.questions;
    let IdAnswer=-1;

    for(let cont=0;cont<QuizzSelecionado.questions.length;cont++){
        
        QuizzPage.innerHTML +=`
        <section class="question">
            <h4 id="${cont}">${Questions[cont].title}</h4>
            <div id="${IdAnswer}" class="answers"></div>
        </section>`;
            
        const GetToAnswers = document.getElementById(`${IdAnswer}`);
        const answers = Questions[cont].answers;
        answers.sort(embaralhar);

        for(let i= 0;i<answers.length;i++){
            GetToAnswers.innerHTML += `<div class="answer unselected" onclick="selectAnswer(this)">
                    <img src="${answers[i].image}" alt="TESTE">
                    <p>${answers[i].text}</p>
                </div>`
        }

        IdAnswer--;
        let CorTitulo = document.getElementById(`${cont}`);
        CorTitulo.style.setProperty("background-color", `${Questions[cont].color}`)
    }
}

function selectAnswer(elemento){
    elemento.classList.remove('unselected');
    let opacidade = elemento.parentNode.querySelectorAll('.unselected');

    for(let cont=0;cont<opacidade.length;cont++){
        opacidade[cont].style.setProperty("opacity", "0.3");
    }
}

//Função para embaralhar a matriz
function embaralhar() { 
	return Math.random() - 0.5; 
}


// Função para ir para a página de criar Quizzes
function CreateQuizz(){
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.info-quizz').classList.remove('hidden');
}

// Função para validar informações de Criação de Quizz
function verifyInfo() {
    
    let inputLocation = document.querySelectorAll('.info-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if(inputLocation[i].checkValidity()) {
            inputVerifierCounter++;
        }
    }

    if (inputVerifierCounter === inputLocation.length) {
        document.querySelector('.info-quizz').classList.add('hidden');
        document.querySelector('.questions-quizz').classList.remove('hidden');
        quizzTitle = inputLocation[0].value;
        quizzUrl = inputLocation[1].value;
        quizzQuestions = inputLocation[2].value;
        quizzLevels = inputLocation[3].value;
        generateQuestions();
    }
}

// Função para validar perguntas de Criação de Quizz
function verifyQuestions() {
    let inputLocation = document.querySelectorAll('.questions-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if (inputLocation[i].checkValidity()) {
            inputVerifierCounter++;
        }
    }

    if (inputVerifierCounter === inputLocation.length) {
        document.querySelector('.questions-quizz').classList.add('hidden');
        document.querySelector('.levels-quizz').classList.remove('hidden');
        generateLevels();
    }
}

// Função para validar níveis de Criação de Quizz
function verifyLevels() {

    let inputLocation = document.querySelectorAll('.levels-quizz input')
    let inputCheck = 0;
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if (inputLocation[i].checkValidity()) {
            inputVerifierCounter++;
        }
        if (inputLocation[i].value === '0') {
            inputCheck = 1;
        }
    }

    if (inputVerifierCounter === inputLocation.length && inputCheck === 1) {
        document.querySelector('.levels-quizz').classList.add('hidden');
        document.querySelector('.finish-quizz').classList.remove('hidden');
        storeInformation();
        finishQuizz();
    }
}

// Função para voltar a tela Home
function backHome() {
    getQuizzes();
    document.querySelector('.finish-quizz').classList.add('hidden');
    document.querySelector('.quizz-answering').classList.add('hidden');
    document.querySelector('.main-page').classList.remove('hidden');
}

function generateQuestions() {
    const questionsLocale = document.querySelector('.questions-quizz');
    questionsLocale.innerHTML = "<span><strong>Crie suas perguntas</strong></span>";

    for (let i = 1; i <= quizzQuestions; i++) {
        questionsLocale.innerHTML += `
            <div class="container">

                <span><strong>Pergunta ${i}</strong></span>
                <div class="setup questions">
                    <input type="text" name="Texto da Pergunta" required minlength="20" placeholder="Texto da pergunta">
                    <input type="text" name="Cor da Pergunta" required maxlength="7" pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="Cor de fundo da pergunta">
                </div>

                <span><strong>Resposta correta</strong></span>
                <div class="setup questions">
                    <input type="text" name="Resposta" required placeholder="Resposta correta">
                    <input type="url" name="URL" required placeholder="URL da imagem">
                </div>

                <span><strong>Respostas incorretas</strong></span>
                <div class="setup questions">
                    <input type="text" name="Resposta" required placeholder="Resposta incorreta 1">
                    <input type="url" name="URL" required placeholder="URL da imagem 1">
                </div>

                <!--<div class="setup questions">
                    <input type="text" name="Resposta" placeholder="Resposta incorreta 2">
                    <input type="url" name="URL" placeholder="URL da imagem 2">
                </div>

                <div class="setup questions">
                    <input type="text" name="Resposta" placeholder="Resposta incorreta 3">
                    <input type="url" name="URL" placeholder="URL da imagem 3">
                </div> -->

            </div>`
    }

    questionsLocale.innerHTML += `<button onclick="verifyQuestions()">Prosseguir pra criar níveis</button>`;
}

function generateLevels() {
    const levelsLocale = document.querySelector('.levels-quizz');
    levelsLocale.innerHTML = "<span><strong>Agora, decida os níveis!</strong></span>";

    for (let i = 1; i <= quizzLevels; i++) {
        levelsLocale.innerHTML += `
        <div class="container">

                <span><strong>Nível ${i}</strong></span>
                <div class="setup questions">
                    <input type="text" name="Título" required minlength="10" placeholder="Título do nível">
                    <input type="number" name="Percentual" required min="0" max="100" placeholder="% de acerto mínima">
                    <input type="url" name="URL Nível" required placeholder="URL da imagem do nível">
                    <textarea name="Descrição" required rows="5" minlength="30" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `
    }

    levelsLocale.innerHTML += `<button onclick="verifyLevels()">Finalizar Quizz</button>`;
}

function finishQuizz() {
    const finishLocale = document.querySelector('.finish-quizz');

    finishLocale.innerHTML = `
    <span><strong>Seu quizz está pronto!</strong></span>

    <div class="box other-quizzes">
        <div class="title">
            <span>${quizzTitle}</span>
        </div>
    </div>

    <button>Acessar Quizz</button>
    <span onclick="backHome()">Voltar pra home</span>
    `

    let imagemQuizz = document.querySelector(".finish-quizz .box");
    imagemQuizz.style.setProperty("background-image", `${gradient}, url('${quizzUrl}')`);
}

function storeInformation() {
    const titleQuestions = document.getElementsByName("Texto da Pergunta");
    const titleColor = document.getElementsByName("Cor da Pergunta");
    const answerText = document.getElementsByName("Resposta");
    const answerURL = document.getElementsByName("URL");
    const titleLevel = document.getElementsByName("Título");
    const urlLevel = document.getElementsByName("URL Nível");
    const descLevel = document.getElementsByName("Descrição");
    const percentLevel = document.getElementsByName("Percentual");
        
    for (let i = 0; i < titleQuestions.length; i++) {
        questionsTitle.push(titleQuestions[i].value);
    }

    for (let i = 0; i < titleColor.length; i++) {
        questionsColor.push(titleColor[i].value);
    }

    for (let i = 0; i < answerText.length; i++) {
        if (answerText[i].value !== '') {
            questionsAnswer.push(answerText[i].value);
        }
    }

    for (let i = 0; i < answerURL.length; i++) {
        if (answerURL[i].value !== '') {
            questionsURL.push(answerURL[i].value);
        }
    }

    for (let i = 0; i < titleLevel.length; i++) {
        levelsTitle.push(titleLevel[i].value);
    }

    for (let i = 0; i < urlLevel.length; i++) {
        levelsURL.push(urlLevel[i].value);
    }

    for (let i = 0; i < descLevel.length; i++) {
        levelsDesc.push(descLevel[i].value);
    }

    for (let i = 0; i < percentLevel.length; i++) {
        levelsPercent.push(parseInt(percentLevel[i].value));
    }

    sendQuizz();
}

function sendQuizz() {
    const objetoASerEnviado = {
        title: quizzTitle,
        image: quizzUrl,
        questions: [
            {
                title: questionsTitle[0],
                color: questionsColor[0],
                answers: [
                    {
                        text: questionsAnswer[0],
                        image: questionsURL[0],
                        isCorrectAnswer: true
                    },
                    {
                        text: questionsAnswer[1],
                        image: questionsURL[1],
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: questionsTitle[1],
                color: questionsColor[1],
                answers: [
                    {
                        text: questionsAnswer[2],
                        image: questionsURL[2],
                        isCorrectAnswer: true
                    },
                    {
                        text: questionsAnswer[3],
                        image: questionsURL[3],
                        isCorrectAnswer: false
                    }
                ]
            },
            {
                title: questionsTitle[2],
                color: questionsColor[2],
                answers: [
                    {
                        text: questionsAnswer[4],
                        image: questionsURL[4],
                        isCorrectAnswer: true
                    },
                    {
                        text: questionsAnswer[5],
                        image: questionsURL[5],
                        isCorrectAnswer: false
                    }
                ]
            }
        ],
        levels: [
            {
                title: levelsTitle[0],
                image: levelsURL[0],
                text: levelsDesc[0],
                minValue: levelsPercent[0]
            },
            {
                title: levelsTitle[1],
                image: levelsURL[1],
                text: levelsDesc[1],
                minValue: levelsPercent[1]
            }
        ]
    }

    const sendFinishedQuizz = axios.post(BUZZ_API, objetoASerEnviado)
}

getQuizzes();