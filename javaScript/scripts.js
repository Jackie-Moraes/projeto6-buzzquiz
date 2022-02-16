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
        <div class="box" id="${id}" onclick = "EnterQuizz(${id})">
            <div class="title">
                <span>${Quizzes[contador].title}</span>
            </div>
        </div>`

        selecionarImagem = document.getElementById(`${id}`);
        selecionarImagem.style.setProperty("background-image", `${gradient}, url('${Quizzes[contador].image}')`)
    }
}

//Função para pegar o Quizz Clicado
function EnterQuizz(Id){
    const request = axios.get(BUZZ_API +Id); 
    request.then(DeuCerto); 
} 
    
//Função para pegar o Quizz clicado da API
function DeuCerto(message){ 
    console.log(message.data);
}


// Função para ir para a página de criar Quizzes
function CreateQuizz(){
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.info-quizz').classList.remove('hidden');
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