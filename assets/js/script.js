import questions from './question.js';

// DOM 요소 접근
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const submitButton = document.getElementById('submit-button');
const showAnswerButton = document.getElementById('show-answer-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const chapterFilter = document.getElementById('chapter-filter');
const typeFilter = document.getElementById('type-filter');
const currentNumberElement = document.getElementById('current-number');
const totalQuestionsElement = document.getElementById('total-questions');

// 상태 변수
let currentQuestionIndex = 0;
let filteredQuestions = [...questions];
let answeredQuestions = []; // {index, isCorrect, userAnswer}
let reviewMode = false;     // 틀린 문제 다시 풀기 모드
let wrongQuestions = [];    // 틀린 문제 배열

// 초기화 함수
function init() {
    applyFilters();
    updateQuestionCounter();
    displayQuestion();
    
    // 이벤트 리스너 등록
    submitButton.addEventListener('click', handleSubmit);
    showAnswerButton.addEventListener('click', showAnswer);
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', showNextQuestion);
    chapterFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
}

// 필터 적용
var applyFilters = function() {
    reviewMode = false;
    answeredQuestions = [];
    const chapterValue = chapterFilter.value;
    const typeValue = typeFilter.value;
    
    filteredQuestions = questions.filter(question => {
        const chapterMatch = chapterValue === 'all' || question.chapter === chapterValue;
        const typeMatch = typeValue === 'all' || question.type === typeValue;
        return chapterMatch && typeMatch;
    });
    
    // 필터링된 질문이 없을 경우 메시지 표시
    if (filteredQuestions.length === 0) {
        questionContainer.innerHTML = '<p class="no-questions">선택한 조건에 맞는 문제가 없습니다.</p>';
        submitButton.disabled = true;
        showAnswerButton.disabled = true;
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
    }
    
    // 새로운 필터가 적용되면 첫 번째 문제로 이동
    currentQuestionIndex = 0;
    updateQuestionCounter();
    displayQuestion();
    
    // 버튼 상태 업데이트
    updateButtonStates();
}

// 문제 표시
function displayQuestion() {
    if (filteredQuestions.length === 0) return;

    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionContainer.innerHTML = '';
    resultContainer.innerHTML = '';

    // 문제 번호와 챕터 표시
    const questionMeta = document.createElement('div');
    questionMeta.className = 'question-meta';
    questionMeta.innerHTML = `<span class="chapter">${currentQuestion.chapter}</span> <span class="number">문제 ${currentQuestion.number}</span>`;
    questionContainer.appendChild(questionMeta);
    
    // 문제 텍스트 표시
    const questionText = document.createElement('h2');
    questionText.className = 'question-text';
    questionText.textContent = currentQuestion.question;
    questionContainer.appendChild(questionText);
    
    // 문제 유형에 따라 다른 UI 표시
    switch (currentQuestion.type) {
        case 'multiple-choice':
            displayMultipleChoiceQuestion(currentQuestion);
            // 객관식일 때는 버튼 숨기기
            submitButton.style.display = 'none';
            showAnswerButton.style.display = 'none';
            break;
        case 'fill-in-blank':
            displayFillInBlankQuestion(currentQuestion);
            // 다른 문제 유형일 때는 버튼 표시
            submitButton.style.display = 'block';
            showAnswerButton.style.display = 'block';
            break;
        case 'essay':
            displayEssayQuestion(currentQuestion);
            // 다른 문제 유형일 때는 버튼 표시
            submitButton.style.display = 'block';
            showAnswerButton.style.display = 'block';
            break;
    }
    
    // 이미 답변한 문제라면 결과 표시
    const answered = answeredQuestions[currentQuestionIndex];
    if (answered && answered.userAnswer !== undefined) {
        displayResult(answered.isCorrect, answered.userAnswer, currentQuestion.answer);
        // 객관식은 라디오 버튼 비활성화 및 정답 강조
        if (currentQuestion.type === 'multiple-choice') {
            document.querySelectorAll('input[name="option"]').forEach(radio => {
                radio.disabled = true;
                if (radio.value === answered.userAnswer) radio.checked = true;
            });
            document.querySelectorAll('.option-label').forEach(label => {
                const radioInput = label.querySelector('input[type="radio"]');
                if (radioInput.value === currentQuestion.answer) {
                    label.classList.add('correct-answer');
                }
            });
        }
        // 빈칸 채우기, 서술형도 입력값 복원
        if (currentQuestion.type === 'fill-in-blank') {
            const blankInput = document.querySelector('.blank-input');
            if (blankInput) blankInput.value = answered.userAnswer;
        }
        if (currentQuestion.type === 'essay') {
            const essayInput = document.querySelector('.essay-input');
            if (essayInput) essayInput.value = answered.userAnswer;
        }
    }

    // 버튼 상태 업데이트
    updateButtonStates();
}

// 객관식 문제 표시 (수정됨)
function displayMultipleChoiceQuestion(question) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    question.options.forEach((option, index) => {
        const optionLabel = document.createElement('label');
        optionLabel.className = 'option-label';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = option;
        input.id = `option-${index}`;

        // 라디오 버튼에 변경 이벤트 리스너 추가
        input.addEventListener('change', () => {
            if (input.checked) {
                // 선택 즉시 정답 체크
                const isCorrect = option === question.answer;
                displayResult(isCorrect, option, question.answer);

                // 답변 기록 추가
                answeredQuestions[currentQuestionIndex] = {
                    index: currentQuestionIndex,
                    isCorrect,
                    userAnswer: option
                };
                checkAllAnswered();

                // 모든 라디오 버튼 비활성화하여 추가 선택 방지
                document.querySelectorAll('input[name="option"]').forEach(radio => {
                    radio.disabled = true;
                });

                // 정답인 항목 강조
                document.querySelectorAll('.option-label').forEach(label => {
                    const radioInput = label.querySelector('input[type="radio"]');
                    if (radioInput.value === question.answer) {
                        label.classList.add('correct-answer');
                    }
                });
            }
        });

        const labelText = document.createElement('span');
        labelText.textContent = option;

        optionLabel.appendChild(input);
        optionLabel.appendChild(labelText);
        optionsContainer.appendChild(optionLabel);
    });

    questionContainer.appendChild(optionsContainer);
}

// 빈칸 채우기 문제 표시
function displayFillInBlankQuestion(question) {
    const answerContainer = document.createElement('div');
    answerContainer.className = 'fill-blank-container';

    // 문제 텍스트를 빈칸으로 분할
    const questionText = question.question;
    const formattedQuestion = questionText.replace(/\(_+\)/g, '<input type="text" class="blank-input">');

    answerContainer.innerHTML = formattedQuestion;
    questionContainer.appendChild(answerContainer);
    submitButton.disabled = false;
    showAnswerButton.disabled = false; // <-- 여기서 false로 변경
}

// 서술형 문제 표시
function displayEssayQuestion(question) {
    const essayContainer = document.createElement('div');
    essayContainer.className = 'essay-container';

    const textarea = document.createElement('textarea');
    textarea.className = 'essay-input';
    textarea.rows = 6;
    textarea.placeholder = '답변을 작성하세요...';

    essayContainer.appendChild(textarea);
    questionContainer.appendChild(essayContainer);
    submitButton.disabled = false;
    showAnswerButton.disabled = false; // <-- 여기서 false로 변경
}

// 정답 제출 처리
function handleSubmit() {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    let userAnswer = '';
    let isCorrect = false;

    switch (currentQuestion.type) {
        case 'multiple-choice':
            const selectedOption = document.querySelector('input[name="option"]:checked');
            if (selectedOption) {
                userAnswer = selectedOption.value;
                isCorrect = userAnswer === currentQuestion.answer;
            } else {
                showMessage('답을 선택해주세요!', 'warning');
                return;
            }
            break;

        case 'fill-in-blank':
            const blankInput = document.querySelector('.blank-input');
            if (blankInput && blankInput.value.trim()) {
                userAnswer = blankInput.value.trim();
                isCorrect = userAnswer === currentQuestion.answer;
            } else {
                showMessage('빈칸을 채워주세요!', 'warning');
                return;
            }
            break;

        case 'essay':
            const essayInput = document.querySelector('.essay-input');
            if (essayInput && essayInput.value.trim()) {
                userAnswer = essayInput.value.trim();
                showMessage('서술형 문제가 제출되었습니다. 정답을 확인하세요.', 'info');
                // 서술형은 정답 체크하지 않음
                answeredQuestions[currentQuestionIndex] = { index: currentQuestionIndex, isCorrect: null, userAnswer };
                checkAllAnswered();
                return;
            } else {
                showMessage('답변을 작성해주세요!', 'warning');
                return;
            }
    }

    // 결과 표시
    displayResult(isCorrect, userAnswer, currentQuestion.answer);

    // 답변 기록 (filteredQuestions 기준 인덱스 사용)
    answeredQuestions[currentQuestionIndex] = { index: currentQuestionIndex, isCorrect, userAnswer };

    // 모든 문제를 다 풀었는지 확인
    checkAllAnswered();
}

// 모든 문제를 다 풀었는지 확인하고, 틀린 문제 다시 풀기 안내
function checkAllAnswered() {
    // 모든 문제에 대해 답변이 기록되어 있는지 확인
    if (answeredQuestions.length === filteredQuestions.length &&
        answeredQuestions.every(ans => ans !== undefined)) {

        // 틀린 문제만 추출 (filteredQuestions 기준)
        wrongQuestions = answeredQuestions
            .map((ans, idx) => ({ ...ans, question: filteredQuestions[idx] }))
            .filter(ans => ans.isCorrect === false);

        // 안내 메시지 및 버튼 표시
        if (wrongQuestions.length > 0 && !reviewMode) {
            resultContainer.innerHTML = `
                <div class="message info">
                    모든 문제를 풀었습니다.<br>
                    틀린 문제만 다시 풀어보시겠습니까?
                    <button id="retry-wrong-btn" style="margin-left:10px;">틀린 문제 다시 풀기</button>
                </div>
            `;
            document.getElementById('retry-wrong-btn').onclick = startWrongReview;
        } else if (wrongQuestions.length === 0 && !reviewMode) {
            resultContainer.innerHTML = `
                <div class="message correct">
                    모든 문제를 맞췄습니다! 축하합니다!
                </div>
            `;
        } else if (reviewMode && wrongQuestions.length === 0) {
            resultContainer.innerHTML = `
                <div class="message correct">
                    틀린 문제도 모두 맞췄습니다! 잘하셨습니다!
                </div>
            `;
        }
    }
}

// 틀린 문제만 다시 풀기 시작
function startWrongReview() {
    if (wrongQuestions.length === 0) return;
    reviewMode = true;
    filteredQuestions = wrongQuestions.map(w => w.question);
    currentQuestionIndex = 0;
    answeredQuestions = Array(filteredQuestions.length).fill(undefined); // 완전 초기화
    updateQuestionCounter();
    displayQuestion();
    showMessage('틀린 문제만 다시 풀어보세요!', 'info');
}

// 버튼 상태 업데이트
function updateButtonStates() {
    prevButton.disabled = currentQuestionIndex === 0;
    nextButton.disabled = currentQuestionIndex === filteredQuestions.length - 1;
}

// 문제 카운터 업데이트
function updateQuestionCounter() {
    currentNumberElement.textContent = filteredQuestions.length > 0 ? currentQuestionIndex + 1 : 0;
    totalQuestionsElement.textContent = filteredQuestions.length;
}

// 메시지 표시
function showMessage(message, type = 'info') {
    resultContainer.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    resultContainer.appendChild(messageDiv);
    
    // 3초 후 메시지 삭제
    setTimeout(() => {
        if (resultContainer.contains(messageDiv)) {
            resultContainer.removeChild(messageDiv);
        }
    }, 3000);
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', init);