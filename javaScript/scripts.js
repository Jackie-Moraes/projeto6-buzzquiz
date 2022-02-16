// Constante Global

const BUZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/";
let Quizzes= [];

getQuizzes();

// Função para receber quizzes da API
function getQuizzes(){
    const request = axios.get(BUZZ_API + 'quizzes');
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
    for(contador=0;contador<Quizzes.length;contador++){
        AllQuizzes.innerHTML += `
        <div class="box">
            <div class="title">
                <span>${Quizzes[contador].title}</span>
            </div>
        </div>`
    }
}



// Função para ir para a página de criar Quizzes
function CreateQuizz(){
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.creation').classList.remove('hidden');
}