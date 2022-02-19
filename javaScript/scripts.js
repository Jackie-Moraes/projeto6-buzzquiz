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
let QuizzSelecionado = [];
let hitCounter = 0;
let answerCounter = 0;
let QuestionQuant = 0;
let buildQuizz = null;
let serializedQuizz = null;
let serializedList = null;
let savedQuizz = null;
let newID = null;
let questionScroll = [];
let contScroll = 0;

// Função para receber quizzes da API
function getQuizzes(){
    const request = axios.get(BUZZ_API);
    request.then(carregarQuizzes);
    request.catch();
}

// Função para carregar os Quizzes no array
function carregarQuizzes(message){
    Quizzes = message.data;
    savedQuizz = JSON.parse(serializedList);
    mostrarQuizzes();
}

// Função para mostrar os Quizzes na tela 
function mostrarQuizzes(){
    checkLocalStorage();
    const AllQuizzes = document.querySelector('.other-quizzes');
    AllQuizzes.innerHTML = "";
    let selecionarImagem = null;
    for(contador=0;contador<Quizzes.length;contador++){
        const id = Quizzes[contador].id;

        AllQuizzes.innerHTML += `
        <div class="box" id="${id}" onclick = "getQuizz(${id})">
            <div class="title">
                <span>${Quizzes[contador].title}</span>
            </div>
        </div>`

        selecionarImagem = document.getElementById(`${id}`);
        selecionarImagem.style.setProperty("background-image", `${gradient}, url('${Quizzes[contador].image}')`);
    }
}

//Função que checa se o usuário ja criou um quizz
function checkLocalStorage(){
    const storage = localStorage.getItem("myQuizzes");
    const myQuizzes = document.querySelector('.my-quizzes');
    
    if(storage){
        document.querySelector('.allMyQuizzes').classList.remove('hidden');
        
        myQuizzes.innerHTML = '';

        getMyQuizzes(storage);
    } else{
        document.querySelector('.create-first-quizz').classList.remove('hidden');
    }
}

function getMyQuizzes( storage){
    storage = JSON.parse(storage);
    for (let cont = 0; cont<storage.length;cont++){
        const request = axios.get(BUZZ_API + storage[cont]); 
        request.then(printMyQuizzes); 
    }
}

function printMyQuizzes(message){
    const myQuizzes = document.querySelector('.my-quizzes');
    const dados = message.data;
    
    const id = dados.id;

        myQuizzes.innerHTML += `
        <div class="box" id="${id}" onclick = "getQuizz(${id})">
            <div class="title">
                <span>${dados.title}</span>
            </div>
        </div>`

        selecionarImagem = document.getElementById(`${id}`);
        selecionarImagem.style.setProperty("background-image", `${gradient}, url('${dados.image}')`);
}

//Função para pegar o Quizz clicado da API
function getQuizz(Id){
    const request = axios.get(BUZZ_API +Id); 
    request.then(enterQuizz); 
} 
    
//Função para colocar o quizz na tela
function enterQuizz(message){ 
    newID = message.data.id;
    hitCounter = 0;
    answerCounter = 0;
    QuizzSelecionado = message.data;
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.finish-quizz').classList.add('hidden');
    const QuizzPage = document.querySelector('.quizz-answering');
    QuizzPage.classList.remove('hidden');
    QuizzPage.innerHTML = `
    <div class="header-quizz">
    <h2 class="header-title">
    </h2>
    </div>`;
    QuizzPage.querySelector('.header-quizz').scrollIntoView({behavior: "smooth"});
    // Coloca a Imagem e Titulo do Quizz na header da página
    const QuizzHeader = QuizzPage.querySelector('.header-quizz');
    QuizzHeader.style.setProperty("background-image", `${gradient}, url('${QuizzSelecionado.image}')`);
    QuizzHeader.querySelector('.header-title').innerHTML = QuizzSelecionado.title;

    const Questions = QuizzSelecionado.questions;
    let IdAnswer=-1;
    QuestionQuant = Questions.length;
    for(let cont=0;cont<Questions.length;cont++){
        
        QuizzPage.innerHTML +=`
        <section class="question">
            <h4 id="${cont}">${Questions[cont].title}</h4>
            <div id="${IdAnswer}" class="answers"></div>
        </section>`;
            
        const GetToAnswers = document.getElementById(`${IdAnswer}`);
        const answers = Questions[cont].answers;
        answers.sort(shuffle);
        for(let i= 0;i<answers.length;i++){
            if(answers[i].isCorrectAnswer === true){
            GetToAnswers.innerHTML += `<div class="answer unselected" onclick="selectAnswer(this,${answers[i].isCorrectAnswer})">
                    <img src="${answers[i].image}" alt="TESTE">
                    <p class = "certo">${answers[i].text}</p>
                </div>`
            } else {
                GetToAnswers.innerHTML += `<div class="answer unselected " onclick="selectAnswer(this,${answers[i].isCorrectAnswer})">
                <img src="${answers[i].image}" alt="TESTE">
                <p class = "errado">${answers[i].text}</p>
            </div>`
            }
        }

        IdAnswer--;
        let CorTitulo = document.getElementById(`${cont}`);
        CorTitulo.style.setProperty("background-color", `${Questions[cont].color}`)
    }
    questionScroll = document.querySelectorAll('.question');
    contScroll=1;
}

//Função ao clicar na resposta
function selectAnswer(elemento,isCorrect){
    const noClick = elemento.parentNode.querySelectorAll('.unselected');
    const errado = elemento.parentNode.querySelectorAll('.errado');
    const certo = elemento.parentNode.querySelector('.certo');

    for(let cont=0;cont<errado.length;cont++){
        errado[cont].style.setProperty("color", `#FF0B0B`);
    }

    certo.style.setProperty("color", '#009C22');

    for(let cont=0;cont<noClick.length;cont++){
        noClick[cont].onclick = function() {
            return false;
          }
    }
    elemento.classList.remove('unselected');

    if(isCorrect){
        hitCounter++;
    }

    answerCounter++;
    if(answerCounter === QuestionQuant){
        setTimeout(showResult,2000);
    } else{
        setTimeout(scrollIntoQuestion,2000);
    }

    let opacidade = elemento.parentNode.querySelectorAll('.unselected');
    for(let cont=0;cont<opacidade.length;cont++){
        opacidade[cont].style.setProperty("opacity", "0.3");
    }
}

//Função que rola para próxima pergunta
function scrollIntoQuestion(){
    questionScroll[contScroll].scrollIntoView({behavior: "smooth", block: "center"});
    contScroll;
    contScroll++;
    
}

function showResult(){
    const result = parseInt((hitCounter/QuestionQuant) * 100);
    const QuizzPage = document.querySelector('.quizz-answering');
    const levels = QuizzSelecionado.levels;
    let imgResult = null;
    let titleResult = null;
    let textResult = null;

    levels.sort(sortAscending);

    for(let cont = 0;cont<levels.length;cont++){
        if(result >= levels[cont].minValue){
            imgResult = levels[cont].image;
            titleResult = levels[cont].title;
            textResult =  levels[cont].text;
        }
    }

    QuizzPage.innerHTML += `
    <section class="QuizzEnd">
        <div class="result">
            <h4>${result}% de acerto: ${titleResult}</h4>
            <img src="${imgResult}" alt="TESTE">
            <p>${textResult}</p>
        </div>
        <button onclick="getQuizz(${newID})" class="ReiniciarQuizz">Reiniciar Quizz</button>
        <button onclick="backHome()">Voltar pra home</button>
    </section>
    `
    document.querySelector('.result').scrollIntoView({behavior: "smooth",block: "center"});

}

//Função para embaralhar a matriz
function shuffle() { 
	return Math.random() - 0.5; 
}

//Função para colocar array na ordem
function sortAscending(a, b){
    return (a.minValue - b.minValue);
  }


// Função para ir para a página de criar Quizzes
function createQuizz(){
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
    }
}

// Função para voltar a tela Home
function backHome() {
    getQuizzes();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
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
                    <input type="url" name="URL Resposta" required placeholder="URL da imagem">
                </div>

                <span><strong>Respostas incorretas</strong></span>
                <div class="setup questions">
                    <input type="text" name="Resposta" required placeholder="Resposta incorreta 1">
                    <input type="url" name="URL Resposta" required placeholder="URL da imagem 1">
                </div>

                <!--<div class="setup questions">
                    <input type="text" name="Resposta" placeholder="Resposta incorreta 2">
                    <input type="url" name="URL Resposta" placeholder="URL da imagem 2">
                </div>

                <div class="setup questions">
                    <input type="text" name="Resposta" placeholder="Resposta incorreta 3">
                    <input type="url" name="URL Resposta" placeholder="URL da imagem 3">
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
                    <input type="text" name="Título Nível" required minlength="10" placeholder="Título do nível">
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

    <button class="accessQuizz" onclick="getQuizz(${newID})">Acessar Quizz</button>
    <button onclick="backHome()">Voltar pra home</button>
    `

    let imagemQuizz = document.querySelector(".finish-quizz .box");
    imagemQuizz.style.setProperty("background-image", `${gradient}, url('${quizzUrl}')`);
}

function storeInformation() {
    const titleQuestions = document.getElementsByName("Texto da Pergunta");
    const titleColor = document.getElementsByName("Cor da Pergunta");
    const answerText = document.getElementsByName("Resposta");
    const answerURL = document.getElementsByName("URL Resposta");
    const titleLevel = document.getElementsByName("Título Nível");
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
    buildQuizz = {
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

    const sendFinishedQuizz = axios.post(BUZZ_API, buildQuizz)
    sendFinishedQuizz.then(printQuizz);
}

function printQuizz(newQuizzID) {
    newID = newQuizzID.data.id;
    storeQuizz(newID.toString());
    finishQuizz();
}

//Função que guarda o id do quizz criado num array no local storage
function storeQuizz(id) {
    const storage = localStorage.getItem("myQuizzes");
    let myQuizzesConvert = [];

    if (storage) {
      myQuizzesConvert = JSON.parse(storage);
    }

    myQuizzesConvert.push(id);
    myQuizzesConvert = JSON.stringify(myQuizzesConvert);
    localStorage.setItem("myQuizzes", myQuizzesConvert);
  }

getQuizzes();