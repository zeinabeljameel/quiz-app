
// select elements 
let count = document.querySelector('.count span');
let bullets = document.querySelector('.bullets');
let bulletsContainer = document.querySelector('.bullets .spans');
let quizArea = document.querySelector('.quiz-area');
let images = document.querySelector('.img')
let answersArea = document.querySelector('.answers-area');
let submitAnswer = document.querySelector('.submit-answer');
let myResults = document.querySelector('.results')

let currentIndex = 0;
let rightAnswer = 0;
let numImage = 1;


function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            createBullets(qCount);

            addQuestionData(questionsObject[currentIndex], qCount);

            submitAnswer.onclick = () => {
                numImage++
                let rightAnswer = questionsObject[currentIndex].right_answer;
                currentIndex++;
                checkAnswer(rightAnswer, qCount);

                //remove old Question 
                quizArea.innerHTML = '';
                answersArea.innerHTML = '';

                addQuestionData(questionsObject[currentIndex], qCount);

                activeBulletsClass()

                showResults(qCount)
            }
        }
    }
    myRequest.open("get", "html_questions.json", true);
    myRequest.send();
}
getQuestions()

function createBullets(num) {
    count.innerHTML = num;
    for(let i = 0; i < num; i++) {
        let bullet = document.createElement('span');
        bulletsContainer.appendChild(bullet);
        if(i === 0) {
            bullet.className = 'on'
        }
    }
}


function addQuestionData(obj, count) {
    if(currentIndex < count) {
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj.title);

        questionTitle.appendChild(questionText);
        quizArea.appendChild(questionTitle)


        for(let i = 1; i <= 3; i++) {
            let mainDiv = document.createElement('div');
            mainDiv.className = 'answer';
            
            let radioInput = document.createElement('input');
            radioInput.name = 'question'
            radioInput.type = 'radio'
            radioInput.id = `answer_${i}`
            radioInput.dataset.answer = obj[`answer_${i}`];
            if (i === 1) {
                radioInput.checked = true
            }
        
            let label = document.createElement('label');
            label.htmlFor = `answer_${i}`;
            let labelText = document.createTextNode(obj[`answer_${i}`]);
        
            label.appendChild(labelText);
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(label);
            answersArea.appendChild(mainDiv);
        }
    }
}



function checkAnswer(rAnswe, count) {
    let allAnswers = document.getElementsByName('question');
    let theChosenAnswer;

    for(let i = 0; i < allAnswers.length; i++) {
        if(allAnswers[i].checked) {
            theChosenAnswer = allAnswers[i].dataset.answer
        }
    }
    
    if(rAnswe === theChosenAnswer) {
        rightAnswer++
    }

}

function activeBulletsClass() {

    let allBullets = document.querySelectorAll('.bullets .spans span');
    let arrayOfSpans = Array.from(allBullets)
    arrayOfSpans.forEach((span, index)=> {
        if(currentIndex === index){
            span.className = 'on'
        }
    })

}


function showResults(count) {
    let results;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitAnswer.remove()
        bullets.remove();

        if(rightAnswer > (count / 2) && rightAnswer < count) {
            results = `<span class="good">جيد</span> : ${rightAnswer} من ${count}` 
        }else if(rightAnswer === count) {
            results = `<span class="perfect">ممتاز جميع اجاباتك صحيحة</span> : ${rightAnswer} من ${count}` 
        }else {
            results = `<span class="bad">مقبول</span> : ${rightAnswer} من ${count}` 
        }
        myResults.innerHTML = results
    }
}