import questions from './question.js';

// DOM 요소 추가
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
const selectionContainer = document.getElementById('selection-container'); // 새로 추가
const startButton = document.getElementById('start-button'); // 새로 추가
const quizContainer = document.getElementById('quiz-container'); // 새로 추가
const resetButton = document.getElementById('reset-button'); // 새로 추가

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
    
    // 리셋 버튼 이벤트 리스너
    resetButton.addEventListener('click', resetQuiz);
    
    // 필터 적용 버튼 이벤트 리스너 수정
    document.getElementById('apply-filters').addEventListener('click', function() {
        applyFilters();
    });
}

// 선택 화면 표시 함수 (신규)
function showSelectionScreen() {
    selectionContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    
    // 기본값 설정
    const chapterFilter = document.getElementById('chapter-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (chapterFilter) chapterFilter.value = '전체';
    if (typeFilter) typeFilter.value = '전체';
}

// 필터 적용 함수
function applyFilters() {
    const chapterFilter = document.getElementById('chapter-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (!chapterFilter || !typeFilter) return;
    
    const chapterValue = chapterFilter.value;
    const typeValue = typeFilter.value;
    
    console.log('필터 적용:', { 챕터: chapterValue, 유형: typeValue });
    
    filteredQuestions = questions.filter(question => {
        const chapterMatch = chapterValue === "전체" || question.chapter === chapterValue;
        const typeMatch = typeValue === "전체" || question.type === typeValue;
        return chapterMatch && typeMatch;
    });
    
    console.log(`필터링된 문제: ${filteredQuestions.length}개`);
    
    // 퀴즈가 시작된 경우에만 버튼 상태와 카운터 업데이트
    if (quizStarted) {
        updateButtonStates();
        updateQuestionCounter();
    }
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
                return;
            } else {
                showMessage('답변을 작성해주세요!', 'warning');
                return;
            }
    }
    
    // 결과 표시
    displayResult(isCorrect, userAnswer, currentQuestion.answer);
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

// 다음 문제 표시
function showNextQuestion() {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
        currentQuestionIndex++;
        updateQuestionCounter();
        displayQuestion();
    } else {
        // 마지막 문제인 경우 
        if (!isReviewMode && incorrectQuestions.length > 0) {
            // 오답 문제가 있으면 다시 풀기 버튼 표시
            showReviewButton();
        } else if (isReviewMode) {
            // 오답 복습 모드에서 마지막 문제를 풀면 종료 메시지
            showMessage('모든 오답 문제를 복습했습니다!', 'success');
            // 일반 모드로 돌아가는 버튼 표시
            showReturnToNormalButton();
        } else {
            // 모든 문제를 다 풀었고 오답도 없는 경우
            showMessage('모든 문제를 완료했습니다!', 'success');
            // 다시 선택 화면으로 돌아가는 버튼 표시
            showResetButton();
        }
    }
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

// 오답 복습 버튼 표시 함수 (신규)
function showReviewButton() {
    resultContainer.innerHTML = '';
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message info';
    messageDiv.textContent = `모든 문제를 완료했습니다! 틀린 문제가 ${incorrectQuestions.length}개 있습니다.`;
    
    const reviewButton = document.createElement('button');
    reviewButton.textContent = '틀린 문제 다시 풀기';
    reviewButton.className = 'review-button';
    reviewButton.addEventListener('click', startReviewMode);
    
    resultContainer.appendChild(messageDiv);
    resultContainer.appendChild(reviewButton);
}

// 일반 모드로 돌아가는 버튼 표시 함수 (신규)
function showReturnToNormalButton() {
    const returnButton = document.createElement('button');
    returnButton.textContent = '일반 모드로 돌아가기';
    returnButton.className = 'return-button';
    returnButton.addEventListener('click', returnToNormalMode);
    
    resultContainer.appendChild(returnButton);
}

// 오답 복습 모드 시작 함수 (신규)
function startReviewMode() {
    isReviewMode = true;
    filteredQuestions = [...incorrectQuestions];
    currentQuestionIndex = 0;
    
    // 복습 모드 시작 메시지
    showMessage('오답 복습 모드를 시작합니다.', 'info');
    
    updateQuestionCounter();
    displayQuestion();
}

// 일반 모드로 돌아가는 함수 (신규)
function returnToNormalMode() {
    isReviewMode = false;
    incorrectQuestions = []; // 오답 목록 초기화
    
    // 원래 필터 상태로 복원하되 선택 화면으로 돌아가기
    resetQuiz();
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 헤더에서는 제목만 남기고 모든 드롭박스 제거
    cleanupHeader();
    
    // 하단에 새로운 드롭박스 생성
    createNewDropdowns();
    
    // 기존 초기화 함수 호출 (드롭박스 관련 코드 제외)
    init();
});

// 헤더 정리 함수 - 제목만 남기고 모든 드롭박스 제거
function cleanupHeader() {
    const header = document.querySelector('header') || 
                  document.querySelector('.navbar') || 
                  document.querySelector('.header-area');
                  
    if (header) {
        // 제목 요소 저장
        const title = header.querySelector('h1') || header.querySelector('h2');
        const titleText = title ? title.textContent : '2025 운영체제 기말';
        
        // 헤더 내용 지우기
        header.innerHTML = '';
        
        // 제목만 다시 추가
        const newTitle = document.createElement('h1');
        newTitle.textContent = titleText;
        newTitle.style.textAlign = 'center';
        newTitle.style.padding = '20px 0';
        header.appendChild(newTitle);
    }
    
    // 모든 상단 드롭박스 및 관련 요소 제거를 위한 CSS
    const style = document.createElement('style');
    style.textContent = `
        body > header select,
        body > header .selector-container,
        body > header label,
        body > .navbar select,
        body > .navbar .selector-container,
        body > .navbar label,
        body > div:not(#selection-container) select,
        body > div:not(#selection-container) label {
            display: none !important;
        }
        
        header, .navbar {
            padding: 20px 0;
            text-align: center;
            margin-bottom: 30px;
        }
    `;
    document.head.appendChild(style);
}

// 하단에 새로운 드롭박스 생성 함수
function createNewDropdowns() {
    // 선택 컨테이너 찾기
    const selectionContainer = document.getElementById('selection-container');
    if (!selectionContainer) return;
    
    // 기존 드롭다운 요소 참조 (이벤트 핸들러 연결을 위해)
    const chapterFilterId = 'chapter-filter';
    const typeFilterId = 'type-filter';
    
    // 출제 범위 및 유형 선택 영역 생성
    const selectionArea = document.createElement('div');
    selectionArea.className = 'selection-area';
    selectionArea.innerHTML = `
        <h2>출제 범위 및 유형 선택</h2>
        
        <div class="filter-group">
            <label for="${chapterFilterId}">출제 범위:</label>
            <select id="${chapterFilterId}" class="form-control">
                <option value="전체">전체</option>
                <option value="1장">1장</option>
                <option value="3장">3장</option>
                <option value="4장">4장</option>
            </select>
        </div>
        
        <div class="filter-group">
            <label for="${typeFilterId}">문제 유형:</label>
            <select id="${typeFilterId}" class="form-control">
                <option value="전체">전체</option>
                <option value="multiple-choice">객관식</option>
                <option value="fill-in-blank">주관식</option>
                <option value="essay">서술형</option>
            </select>
        </div>
        
        <button id="apply-filters" class="btn btn-primary">필터 적용</button>
        <button id="start-button" class="btn btn-success">학습 시작하기</button>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .selection-area {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .selection-area h2 {
            margin-bottom: 20px;
            text-align: center;
            font-size: 24px;
            color: #333;
        }
        
        .filter-group {
            margin-bottom: 15px;
        }
        
        .filter-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        
        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            margin-bottom: 15px;
            background-color: white;
        }
        
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 5px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        
        .btn-primary {
            background-color: #007bff;
            color: white;
        }
        
        .btn-success {
            background-color: #4CAF50;
            color: white;
            width: 100%;
            padding: 15px;
            font-size: 18px;
            margin-top: 10px;
        }
        
        .btn:hover {
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
    
    // 기존 내용을 새 컨텐츠로 교체
    selectionContainer.innerHTML = '';
    selectionContainer.appendChild(selectionArea);
    
    // 이벤트 리스너 연결
    document.getElementById('apply-filters').addEventListener('click', applyFilters);
    document.getElementById('start-button').addEventListener('click', startQuiz);
}

// 초기화 함수 수정 - 드롭박스 관련 코드 제거
function init() {
    incorrectQuestions = [];
    isReviewMode = false;
    quizStarted = false;
    
    // 선택 화면 표시, 문제 화면 숨김
    showSelectionScreen();
    
    // 이벤트 리스너 등록 (드롭박스 관련 제외)
    submitButton.addEventListener('click', handleSubmit);
    showAnswerButton.addEventListener('click', showAnswer);
    prevButton.addEventListener('click', showPreviousQuestion);
    nextButton.addEventListener('click', showNextQuestion);
    resetButton.addEventListener('click', resetQuiz);
}

// 선택 화면 표시 함수 수정 - 드롭박스 초기화 코드 제거
function showSelectionScreen() {
    selectionContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    
    // 기본값 설정
    const chapterFilter = document.getElementById('chapter-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (chapterFilter) chapterFilter.value = '전체';
    if (typeFilter) typeFilter.value = '전체';
}

// 필터 적용 함수
function applyFilters() {
    const chapterFilter = document.getElementById('chapter-filter');
    const typeFilter = document.getElementById('type-filter');
    
    if (!chapterFilter || !typeFilter) return;
    
    const chapterValue = chapterFilter.value;
    const typeValue = typeFilter.value;
    
    console.log('필터 적용:', { 챕터: chapterValue, 유형: typeValue });
    
    filteredQuestions = questions.filter(question => {
        const chapterMatch = chapterValue === "전체" || question.chapter === chapterValue;
        const typeMatch = typeValue === "전체" || question.type === typeValue;
        return chapterMatch && typeMatch;
    });
    
    console.log(`필터링된 문제: ${filteredQuestions.length}개`);
    
    // 퀴즈가 시작된 경우에만 버튼 상태와 카운터 업데이트
    if (quizStarted) {
        updateButtonStates();
        updateQuestionCounter();
    }
}

// 퀴즈 시작 함수
function startQuiz() {
    // 필터 적용
    applyFilters();
    
    // 필터링된 문제가 있는지 확인
    if (filteredQuestions.length === 0) {
        alert('선택한 조건에 맞는 문제가 없습니다. 다른 조건을 선택해주세요.');
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

