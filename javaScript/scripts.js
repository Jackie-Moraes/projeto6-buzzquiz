// Constante Global

const BUZZ_API = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

// Função para ir para a página de criar Quizzes
function CreateQuizz(){
    document.querySelector('.main-page').classList.add('hidden');
    document.querySelector('.creation').classList.remove('hidden');
}