// Constante Global

const BUZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let Quizzes= [];
let gradient = "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%)"

getQuizzes();

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
    AllQuizzes.innerHTML = "";
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

function createQuestions() {
    
    let inputLocation = document.querySelectorAll('.info-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if(!inputLocation[i].checkValidity()) {
            alert(`Preencha o campo "${inputLocation[i].name}" corretamente.`)
        } else {
            inputVerifierCounter++;
        }
    }

    if (inputVerifierCounter === inputLocation.length) {
        document.querySelector('.info-quizz').classList.add('hidden');
        document.querySelector('.questions-quizz').classList.remove('hidden');
    }
}

function createLevels() {

    let inputLocation = document.querySelectorAll('.questions-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if (!inputLocation[i].checkValidity()) {
            alert(`Preencha o campo "${inputLocation[i].name}" corretamente.`)
        } else {
            inputVerifierCounter++;
        }
    }

    if (inputVerifierCounter === inputLocation.length) {
        document.querySelector('.questions-quizz').classList.add('hidden');
        document.querySelector('.levels-quizz').classList.remove('hidden');
    }
}

function finishQuizz() {

    let inputLocation = document.querySelectorAll('.levels-quizz input')
    let inputVerifierCounter = 0;

    for (let i = 0; i < inputLocation.length; i++) {
        if (!inputLocation[i].checkValidity()) {
            alert(`Preencha o campo "${inputLocation[i].name}" corretamente.`)
        } else {
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