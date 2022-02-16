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

    for(let cont=0;cont<QuizzSelecionado.questions.length;cont++){
        
        QuizzPage.innerHTML +=`
        <div class="question">
            <h4 id="${cont}">${Questions[cont].title}</h4>
            <div class="answers">
                <div class="answer">
                    <img src="/images/teste.jpg" alt="TESTE">
                    <p>teste</p>
                </div>
                <div class="answer">
                    <img src="/images/teste.jpg" alt="TESTE">
                    <p>teste</p>
                </div>
                <div class="answer">
                    <img src="/images/teste.jpg" alt="TESTE">
                    <p>teste</p>
                </div>
                <div class="answer">
                    <img src="/images/teste.jpg" alt="TESTE">
                    <p>teste</p>
                </div>
            </div>
        </div>
        `;
        let CorTitulo = document.getElementById(`${cont}`);
        CorTitulo.style.setProperty("background-color", `${Questions[cont].color}`)
    }


}


// Função para ir para a página de criar Quizzes
function CreateQuizz(){
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.quizz-answering').classList.remove('hidden');
}

function verifyQuestions() {
    
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

function verifyLevels() {

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

function verifyFinishQuizz() {

    let inputLocation = document.querySelectorAll('.levels-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if (inputLocation[i].checkValidity()) {
            inputVerifierCounter++;
        }
    }

    if (inputVerifierCounter === inputLocation.length) {
        document.querySelector('.levels-quizz').classList.add('hidden');
        document.querySelector('.finish-quizz').classList.remove('hidden');
    }
}

function backHome() {
    getQuizzes();
    document.querySelector('.finish-quizz').classList.add('hidden');
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
                    <input type="text" name="Texto da Pergunta ${i}" required minlength="20" placeholder="Texto da pergunta">
                    <input type="text" name="Cor da Pergunta ${i}" required maxlength="7" pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$" placeholder="Cor de fundo da pergunta">
                </div>

                <span><strong>Resposta correta</strong></span>
                <div class="setup questions">
                    <input type="text" name="Resposta Correta (Pergunta ${i})" required placeholder="Resposta correta">
                    <input type="url" name="URL da Imagem Correta (Pergunta ${i})" required placeholder="URL da imagem">
                </div>

                <span><strong>Respostas incorretas</strong></span>
                <div class="setup questions">
                    <input type="text" name="Resposta Incorreta 1 (Pergunta ${i})" required placeholder="Resposta incorreta 1">
                    <input type="url" name="URL da Imagem Incorreta 1 (Pergunta ${i})" required placeholder="URL da imagem 1">
                </div>

                <div class="setup questions">
                    <input type="text" name="Resposta Incorreta 2 (Pergunta ${i})" placeholder="Resposta incorreta 2">
                    <input type="url" name="URL da Imagem Incorreta 2 (Pergunta ${i})" placeholder="URL da imagem 2">
                </div>

                <div class="setup questions">
                    <input type="text" name="Resposta Incorreta 3 (Pergunta ${i})" placeholder="Resposta incorreta 3">
                    <input type="url" name="URL da Imagem Incorreta 3 (Pergunta ${i})" placeholder="URL da imagem 3">
                </div>

            </div>`
    }

    questionsLocale.innerHTML += `<button onclick="verifyLevels()">Prosseguir pra criar níveis</button>`;
}

function generateLevels() {
    const levelsLocale = document.querySelector('.levels-quizz');
    levelsLocale.innerHTML = "<span><strong>Agora, decida os níveis!</strong></span>";

    for (let i = 1; i <= quizzLevels; i++) {
        levelsLocale.innerHTML += `
        <div class="container">

                <span><strong>Nível ${i}</strong></span>
                <div class="setup questions">
                    <input type="text" name="Título Nível ${i}" required minlength="10" placeholder="Título do nível">
                    <input type="number" name="Percentual Nível ${i}" required min="0" max="100" placeholder="% de acerto mínima">
                    <input type="url" name="URL da Imagem Nível ${i}" required placeholder="URL da imagem do nível">
                    <textarea name="Descrição Nível ${i}" required rows="5" minlength="30" placeholder="Descrição do nível"></textarea>
                </div>
            </div>
        `
    }

    levelsLocale += `<button onclick="verifyFinishQuizz()">Finalizar Quizz</button>`;
}

getQuizzes();