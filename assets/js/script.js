import questions from './question.js';

// DOM 요소 추가
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const submitButton = document.getElementById('submit-button');
const showAnswerButton = document.getElementById('show-answer-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const currentNumberElement = document.getElementById('current-number');
const totalQuestionsElement = document.getElementById('total-questions');
const selectionContainer = document.getElementById('selection-container'); // 새로 추가
const startButton = document.getElementById('start-button'); // 새로 추가
const quizContainer = document.getElementById('quiz-container'); // 새로 추가
const resetButton = document.getElementById('reset-button'); // 새로 추가
const selectionChapterFilter = document.getElementById('selection-chapter-filter');
const selectionTypeFilter = document.getElementById('selection-type-filter');

// 상태 변수
let currentQuestionIndex = 0;
let filteredQuestions = [];  // 빈 배열로 시작
let incorrectQuestions = []; // 틀린 문제 저장 배열
let isReviewMode = false; // 오답 복습 모드 여부
let quizStarted = false;  // 퀴즈 시작 여부 추가

// 초기화 함수 수정
function init() {
    incorrectQuestions = [];
    isReviewMode = false;
    quizStarted = false;
    
    // 선택 화면 표시, 문제 화면 숨김
    showSelectionScreen();
    
    // 이벤트 리스너 등록
    submitButton.addEventListener('click', handleSubmit);
    showAnswerButton.addEventListener('click', showAnswer);
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', showNextQuestion);
    resetButton.addEventListener('click', resetQuiz);
    
    // 시작 버튼 이벤트 리스너 추가
    console.log('startButton:', startButton);
    console.log('selectionChapterFilter:', selectionChapterFilter);
    console.log('selectionTypeFilter:', selectionTypeFilter);
    startButton.addEventListener('click', () => {
        // 필터 값 검증
        const selectedChapter = selectionChapterFilter.value;
        const selectedType = selectionTypeFilter.value;
        
        if (selectedChapter === '선택하세요' || selectedType === '선택하세요') {
            showMessage('출제 범위와 문제 유형을 모두 선택해주세요.', 'warning');
            return;
        }
        
        startQuiz();
    });
}

// 선택 화면 표시 함수 (신규)
function showSelectionScreen() {
    selectionContainer.style.display = 'block';
    quizContainer.style.display = 'none';
}

// 필터링 함수 수정
function filterQuestions() {
    const selectedChapter = selectionChapterFilter.value;
    const selectedType = selectionTypeFilter.value;
    
    // 모든 문제를 가져옴
    let filtered = [...questions];
    
    // 챕터 필터링
    if (selectedChapter !== 'all') {
        filtered = filtered.filter(q => q.chapter === selectedChapter);
    }
    
    // 유형 필터링
    if (selectedType !== 'all') {
        filtered = filtered.filter(q => q.type === selectedType);
    }
    
    // 필터링된 문제가 있는지 확인
    if (filtered.length === 0) {
        showMessage('선택한 조건에 맞는 문제가 없습니다.', 'warning');
        return false;
    }
    
    // 필터링된 문제 목록 저장
    filteredQuestions = filtered;
    return true;
}

// startQuiz 함수 수정
function startQuiz() {
    // 필터링 실행
    if (!filterQuestions()) {
        return;
    }
    
    // 퀴즈 시작 상태로 변경
    quizStarted = true;
    
    // 선택 화면 숨기고 퀴즈 화면 표시
    selectionContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    
    // 첫 문제 표시
    currentQuestionIndex = 0;
    updateQuestionCounter();
    displayQuestion();
}

// 문제 표시
function displayQuestion() {
    if (filteredQuestions.length === 0) return;
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    questionContainer.innerHTML = '';  // 컨테이너 초기화
    resultContainer.innerHTML = '';    // 결과 컨테이너 초기화
    
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
            submitButton.style.display = 'none';        // 제출 버튼 숨김
            showAnswerButton.style.display = 'none';    // 정답 보기 버튼 숨김
            break;
        case 'fill-in-blank':
            displayFillInBlankQuestion(currentQuestion);
            submitButton.style.display = 'block';        // 제출 버튼 표시
            showAnswerButton.style.display = 'block';    // 정답 보기 버튼 표시
            break;
        case 'essay':
            displayEssayQuestion(currentQuestion);
            submitButton.style.display = 'block';        // 제출 버튼 표시
            showAnswerButton.style.display = 'block';    // 정답 보기 버튼 표시
            break;
    }
    
    // 버튼 상태 업데이트
    updateButtonStates();
}

// 객관식 문제 표시 함수 수정
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

                // 마지막 문제인 경우 잠시 후 선택지 표시
                if (currentQuestionIndex === filteredQuestions.length - 1) {
                    setTimeout(() => {
                        handleLastQuestion();
                    }, 1500); // 1.5초 후 선택지 표시
                }
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

// 빈칸 채우기 문제 표시 함수 수정
function displayFillInBlankQuestion(question) {
    const answerContainer = document.createElement('div');
    answerContainer.className = 'fill-blank-container';

    // 괄호 안에 언더바가 2개 이상 있을 때만 입력 칸으로 변환
    const formattedQuestion = question.question.replace(/\(([^)]*)\)/g, function(match, inner) {
        if ((inner.match(/_/g) || []).length >= 2) {
            return '<input type="text" class="blank-input" placeholder="정답 입력">';
        }
        return match;
    });

    answerContainer.innerHTML = formattedQuestion;
    questionContainer.appendChild(answerContainer);

    submitButton.style.display = 'block';
    showAnswerButton.style.display = 'block';
    submitButton.disabled = false;
    showAnswerButton.disabled = false;
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
    showAnswerButton.disabled = false;
}

// 정답 제출 처리 함수 수정
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
                // 정답 비교 시 대소문자 구분 없이 비교
                isCorrect = userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase();
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
                return;
            } else {
                showMessage('답변을 작성해주세요!', 'warning');
                return;
            }
    }
    
    // 결과 표시
    displayResult(isCorrect, userAnswer, currentQuestion.answer);
    
    // 빈칸 채우기 문제의 경우 입력 필드 비활성화
    if (currentQuestion.type === 'fill-in-blank') {
        const blankInput = document.querySelector('.blank-input');
        if (blankInput) {
            blankInput.disabled = true;
        }
    }
}

// 결과 표시
function displayResult(isCorrect, userAnswer, correctAnswer) {
    resultContainer.innerHTML = '';
    
    const resultDiv = document.createElement('div');
    resultDiv.className = isCorrect ? 'result correct' : 'result incorrect';
    
    const resultIcon = document.createElement('span');
    resultIcon.className = 'result-icon';
    resultIcon.textContent = isCorrect ? '✓' : '✗';
    
    const resultText = document.createElement('p');
    resultText.className = 'result-text';
    resultText.textContent = isCorrect 
        ? '정답입니다!' 
        : `오답입니다. 정답은 "${correctAnswer}" 입니다.`;
    
    resultDiv.appendChild(resultIcon);
    resultDiv.appendChild(resultText);
    resultContainer.appendChild(resultDiv);
    
    // 틀린 문제 저장 (오답 복습 모드가 아닐 때만)
    if (!isCorrect && !isReviewMode) {
        // 이미 저장된 문제인지 확인
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        const alreadySaved = incorrectQuestions.some(q => 
            q.question === currentQuestion.question && 
            q.chapter === currentQuestion.chapter
        );
        
        if (!alreadySaved) {
            incorrectQuestions.push(currentQuestion);
        }
    }
}

// 정답 보기
function showAnswer() {
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    
    resultContainer.innerHTML = '';
    const answerDiv = document.createElement('div');
    answerDiv.className = 'answer-reveal';
    
    const answerTitle = document.createElement('h3');
    answerTitle.textContent = '정답:';
    
    const answerText = document.createElement('p');
    answerText.textContent = currentQuestion.answer;
    
    answerDiv.appendChild(answerTitle);
    answerDiv.appendChild(answerText);
    resultContainer.appendChild(answerDiv);
}

// 이전 문제 표시
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestionCounter();
        displayQuestion();
    }
}

// 다음 문제 표시 함수 수정
function showNextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        updateQuestionCounter();
        displayQuestion();
    } else {
        // 마지막 문제를 풀었을 때 처리
        handleLastQuestion();
    }
}

// 마지막 문제 처리 함수 추가
function handleLastQuestion() {
    // 틀린 문제가 있는지 확인
    const hasIncorrectQuestions = incorrectQuestions.length > 0;
    
    // 결과 컨테이너 초기화
    resultContainer.innerHTML = '';
    
    // 선택지를 보여주는 컨테이너 생성
    const choiceContainer = document.createElement('div');
    choiceContainer.className = 'choice-container';
    
    // 메시지 생성
    const message = document.createElement('p');
    message.className = 'message info';
    message.textContent = '모든 문제를 풀었습니다.';
    choiceContainer.appendChild(message);
    
    // 버튼 컨테이너 생성
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'action-buttons';
    
    // 틀린 문제가 있는 경우에만 오답 복습 버튼 표시
    if (hasIncorrectQuestions) {
        const reviewButton = document.createElement('button');
        reviewButton.textContent = '틀린 문제 다시 풀기';
        reviewButton.className = 'review-button';
        reviewButton.addEventListener('click', () => {
            // 오답 복습 모드로 전환
            isReviewMode = true;
            filteredQuestions = [...incorrectQuestions];
            currentQuestionIndex = 0;
            updateQuestionCounter();
            displayQuestion();
            choiceContainer.remove(); // 선택지 컨테이너 제거
        });
        buttonContainer.appendChild(reviewButton);
    }
    
    // 새로운 범위 선택 버튼
    const newRangeButton = document.createElement('button');
    newRangeButton.textContent = '새로운 범위 선택하기';
    newRangeButton.className = 'return-button';
    newRangeButton.addEventListener('click', () => {
        // 선택 화면으로 돌아가기
        resetQuiz();
        choiceContainer.remove(); // 선택지 컨테이너 제거
    });
    buttonContainer.appendChild(newRangeButton);
    
    choiceContainer.appendChild(buttonContainer);
    resultContainer.appendChild(choiceContainer);
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

// 페이지 로드 시 초기화 수정
document.addEventListener('DOMContentLoaded', function() {
    init();
    
    // 필터 변경 이벤트 리스너
    if (selectionChapterFilter) {
        selectionChapterFilter.addEventListener('change', () => {
            // 필터가 변경될 때마다 문제 수 업데이트
            filterQuestions();
        });
    }
    
    if (selectionTypeFilter) {
        selectionTypeFilter.addEventListener('change', () => {
            // 필터가 변경될 때마다 문제 수 업데이트
            filterQuestions();
        });
    }
});

// 리셋 버튼 표시 함수
function showResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '처음으로 돌아가기';
    resetBtn.className = 'reset-button';
    resetBtn.addEventListener('click', resetQuiz);
    
    resultContainer.appendChild(resetBtn);
}

// 퀴즈 리셋 함수
function resetQuiz() {
    // 상태 초기화
    incorrectQuestions = [];
    isReviewMode = false;
    quizStarted = false;
    currentQuestionIndex = 0;
    filteredQuestions = [];
    
    // 필터 초기화
    selectionChapterFilter.value = '선택하세요';
    selectionTypeFilter.value = '선택하세요';
    
    // 선택 화면으로 돌아가기
    showSelectionScreen();
}

// CSS 스타일 추가
const style = document.createElement('style');
style.textContent = `
.choice-container {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-top: 2rem;
}

.choice-container .message {
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
}

.choice-container .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.choice-container button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}

.choice-container .review-button {
    background-color: #4CAF50;
    color: white;
}

.choice-container .review-button:hover {
    background-color: #388E3C;
}

.choice-container .return-button {
    background-color: #2196F3;
    color: white;
}

.choice-container .return-button:hover {
    background-color: #1976D2;
}
`;
document.head.appendChild(style);

