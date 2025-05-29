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

// 점수 관련 변수 추가
let scoreByChapter = {};
let totalScore = 0;
let totalQuestions = 0;

// 초기화 함수 수정
function init() {
    incorrectQuestions = [];
    isReviewMode = false;
    quizStarted = false;
    
    // 점수 초기화
    initScores();
    
    // 선택 화면 표시, 문제 화면 숨김
    showSelectionScreen();
}

// 점수 초기화 함수 개선
function initScores() {
    scoreByChapter = {};
    totalScore = 0;
    totalQuestions = 0;
    
    // 모든 장에 대한 점수 초기화
    const chapters = [...new Set(questions.map(q => q.chapter))];
    chapters.forEach(chapter => {
        scoreByChapter[chapter] = {
            correct: 0,
            total: questions.filter(q => q.chapter === chapter).length
        };
    });
    
    console.log('점수 초기화 완료:', scoreByChapter);
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
    if (selectedChapter !== 'all' && selectedChapter !== '선택하세요') {
        filtered = filtered.filter(q => q.chapter === selectedChapter);
    }
    
    // 유형 필터링
    if (selectedType !== 'all' && selectedType !== '선택하세요') {
        filtered = filtered.filter(q => q.type === selectedType);
    }
    
    // 필터링된 문제가 있는지 확인
    if (filtered.length === 0) {
        showMessage('선택한 조건에 맞는 문제가 없습니다.', 'warning');
        return false;
    }
    
    // Fisher-Yates 알고리즘을 사용하여 배열을 무작위로 섞기
    for (let i = filtered.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    
    // 필터링되고 섞인 문제 목록 저장
    filteredQuestions = filtered;
    return true;
}

// startQuiz 함수 수정
function startQuiz() {
    // 퀴즈 시작 상태로 변경
    quizStarted = true;
    
    // 선택 화면 숨기고 퀴즈 화면 표시
    selectionContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    
    // 점수 초기화
    initScores();
    
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

// 객관식 문제 표시 함수 수정 - 옵션 랜덤 섞기 추가
function displayMultipleChoiceQuestion(question) {
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    // 원본 옵션과 정답을 저장
    const originalOptions = [...question.options];
    const correctAnswer = question.answer;
    
    // 옵션 배열을 섞기
    const shuffledOptions = [...originalOptions];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    shuffledOptions.forEach((option, index) => {
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
                const isCorrect = option === correctAnswer;
                displayResult(isCorrect, option, correctAnswer);
                
                // 모든 라디오 버튼 비활성화하여 추가 선택 방지
                document.querySelectorAll('input[name="option"]').forEach(radio => {
                    radio.disabled = true;
                });
                
                // 정답인 항목 강조
                document.querySelectorAll('.option-label').forEach(label => {
                    const radioInput = label.querySelector('input[type="radio"]');
                    if (radioInput.value === correctAnswer) {
                        label.classList.add('correct-answer');
                    }
                });

                // 마지막 문제인 경우 잠시 후 결과 페이지 표시
                if (currentQuestionIndex >= filteredQuestions.length - 1) {
                    setTimeout(() => {
                        showQuizResult();
                    }, 1500); // 1.5초 후 결과 페이지 표시
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
            // 모바일 환경을 위한 속성 추가
            return '<input type="text" class="blank-input" placeholder="정답 입력" inputmode="text" enterkeyhint="done">';
        }
        return match;
    });

    answerContainer.innerHTML = formattedQuestion;
    questionContainer.appendChild(answerContainer);

    // 입력 필드에 이벤트 리스너 추가
    const blankInput = document.querySelector('.blank-input');
    if (blankInput) {
        // 모바일 환경을 위한 blur 이벤트
        blankInput.addEventListener('blur', () => {
            // 입력 필드에서 포커스가 벗어날 때 자동 제출 (선택적)
            if (blankInput.value.trim() && !blankInput.disabled) {
                handleSubmit();
            }
        });
        
        // 자동 포커스 설정
        setTimeout(() => {
            blankInput.focus();
        }, 100);
    }

    submitButton.style.display = 'block';
    showAnswerButton.style.display = 'block';
    submitButton.disabled = false;
    showAnswerButton.disabled = false;
}

// 전역 키 이벤트 리스너 수정
document.addEventListener('keydown', function(event) {
    // 퀴즈가 시작된 경우에만 처리
    if (!quizStarted) return;
    
    // 엔터키 눌렸을 때 처리
    if (event.key === 'Enter') {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        if (!currentQuestion) return;
        
        // 현재 문제가 빈칸 채우기인 경우
        if (currentQuestion.type === 'fill-in-blank') {
            event.preventDefault();
            
            const blankInput = document.querySelector('.blank-input');
            if (!blankInput) return;
            
            // 이미 제출된 상태인지 확인 (disabled 상태)
            if (blankInput.disabled) {
                // 이미 제출된 상태라면 다음 문제로 이동
                showNextQuestion();
            } else {
                // 아직 제출되지 않았다면 제출
                handleSubmit();
            }
        }
    }
});

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

// 정답 검증 함수 (예시)
function checkAnswer(userAnswer, correctAnswer) {
    if (Array.isArray(correctAnswer)) {
        return correctAnswer.some(answer => 
            userAnswer.trim().toLowerCase() === answer.trim().toLowerCase());
    } else {
        return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }
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
                
                // 정답이 배열인지 확인하고 그에 맞게 처리
                if (Array.isArray(currentQuestion.answer)) {
                    isCorrect = currentQuestion.answer.some(answer => 
                        userAnswer.trim().toLowerCase() === answer.trim().toLowerCase()
                    );
                } else {
                    isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
                }
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

// 결과 표시 함수에 점수 업데이트 로직 추가
function displayResult(isCorrect, userAnswer, correctAnswer) {
    resultContainer.innerHTML = '';
    
    const resultDiv = document.createElement('div');
    resultDiv.className = isCorrect ? 'result correct' : 'result incorrect';
    
    const resultIcon = document.createElement('span');
    resultIcon.className = 'result-icon';
    resultIcon.textContent = isCorrect ? '✓' : '✗';
    
    const resultText = document.createElement('p');
    resultText.className = 'result-text';
    
    // 정답이 배열인 경우 첫 번째 요소를 표시
    const displayAnswer = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
    
    resultText.textContent = isCorrect 
        ? '정답입니다!' 
        : `오답입니다. 정답은 "${displayAnswer}" 입니다.`;
    
    resultDiv.appendChild(resultIcon);
    resultDiv.appendChild(resultText);
    resultContainer.appendChild(resultDiv);
    
    // 점수 업데이트 (오답 복습 모드가 아닐 때만)
    if (!isReviewMode) {
        const currentQuestion = filteredQuestions[currentQuestionIndex];
        
        // 정답이면 해당 챕터의 점수 증가
        if (isCorrect) {
            scoreByChapter[currentQuestion.chapter].correct++;
            totalScore++;
        }
        
        // 이미 진행한 문제 수 카운트
        totalQuestions++;
    }
    
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
    // 현재가 마지막 문제인 경우 결과 페이지 표시
    if (currentQuestionIndex >= filteredQuestions.length - 1) {
        console.log('마지막 문제 완료, 결과 페이지로 이동');
        showQuizResult();
        return;
    }
    
    // 다음 문제 표시
    currentQuestionIndex++;
    updateQuestionCounter();
    displayQuestion();
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

// 점수 결과 표시 함수
function showQuizResult() {
    console.log('결과 페이지 표시 함수 실행');
    console.log('총점:', totalScore, '총 문제수:', totalQuestions);
    
    questionContainer.innerHTML = '';
    resultContainer.innerHTML = '';
    
    const resultPage = document.createElement('div');
    resultPage.className = 'quiz-result';
    
    // 전체 점수 표시
    const totalScoreElement = document.createElement('h2');
    const percentage = totalQuestions > 0 ? Math.round(totalScore / totalQuestions * 100) : 0;
    totalScoreElement.textContent = `총점: ${totalScore}/${totalQuestions}점 (${percentage}%)`;
    resultPage.appendChild(totalScoreElement);
    
    // 각 장별 점수 표시
    const chapterScores = document.createElement('div');
    chapterScores.className = 'chapter-scores';
    
    let hasChapterScores = false;
    
    Object.keys(scoreByChapter).sort().forEach(chapter => {
        const score = scoreByChapter[chapter];
        if (score && score.total > 0) { // 해당 챕터의 문제를 풀었을 경우만 표시
            hasChapterScores = true;
            const chapterScore = document.createElement('div');
            chapterScore.className = 'chapter-score';
            
            const percentage = Math.round((score.correct / score.total) * 100);
            chapterScore.innerHTML = `
                <h3>${chapter}</h3>
                <p>${score.correct}/${score.total}점 (${percentage}%)</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${percentage}%"></div>
                </div>
            `;
            chapterScores.appendChild(chapterScore);
        }
    });
    
    if (!hasChapterScores) {
        const noScores = document.createElement('p');
        noScores.textContent = '장별 점수가 없습니다.';
        chapterScores.appendChild(noScores);
    }
    
    resultPage.appendChild(chapterScores);
    
    // 다시 시작 버튼
    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = '처음으로';
    restartButton.addEventListener('click', () => {
        init();
    });
    
    resultPage.appendChild(restartButton);
    questionContainer.appendChild(resultPage);
    
    // 버튼 상태 변경
    prevButton.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
    showAnswerButton.style.display = 'none';
    document.getElementById('question-counter').style.display = 'none';
    
    // 퀴즈 완료 상태 설정
    quizStarted = false;
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
    // 초기화 함수 호출
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

// 점수 초기화 함수
function initScores() {
    scoreByChapter = {};
    totalScore = 0;
    totalQuestions = 0;
    
    // 모든 장에 대한 점수 초기화
    const chapters = [...new Set(questions.map(q => q.chapter))];
    chapters.forEach(chapter => {
        scoreByChapter[chapter] = {
            correct: 0,
            total: questions.filter(q => q.chapter === chapter).length
        };
    });
    
    console.log('점수 초기화 완료:', scoreByChapter);
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

.quiz-result {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin-top: 2rem;
}

.quiz-result h2 {
    margin-bottom: 1rem;
    font-size: 1.5rem;
}

.chapter-scores {
    margin: 1.5rem 0;
}

.chapter-score {
    margin-bottom: 1rem;
}

.progress-bar {
    width: 100%;
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
}

.progress {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s;
}

.restart-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    background-color: #2196F3;
    color: white;
    border: none;
    transition: background-color 0.2s;
}

.restart-button:hover {
    background-color: #1976D2;
}
`;
document.head.appendChild(style);

