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
    
    // 기존 필터 변경 이벤트 제거하고 시작 버튼에 등록
    chapterFilter.removeEventListener('change', applyFilters);
    typeFilter.removeEventListener('change', applyFilters);
    startButton.addEventListener('click', startQuiz);
    
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
    
    // 챕터 및 유형 필터 초기화
    populateFilters();
}

// 하단 드롭다운 메뉴 채우기 함수 수정
function populateFilters() {
    // 챕터 목록 추출 - question.js 파일에서 모든 고유 챕터 값을 추출
    const chapters = [...new Set(questions.map(q => q.chapter))].sort();
    
    // 유형 목록 추출 
    const types = [...new Set(questions.map(q => q.type))];
    const typeLabels = {
        'multiple-choice': '객관식',
        'fill-in-blank': '주관식',
        'essay': '서술형'
    };
    
    // 챕터 드롭다운 옵션 완전히 새로 생성
    chapterFilter.innerHTML = '';
    
    // 전체 옵션 먼저 추가
    const allChapterOption = document.createElement('option');
    allChapterOption.value = "전체";
    allChapterOption.textContent = "전체";
    chapterFilter.appendChild(allChapterOption);
    
    // 각 챕터 옵션 추가 (모든 챕터를 명시적으로 추가)
    chapters.forEach(chapter => {
        const option = document.createElement('option');
        option.value = chapter;
        option.textContent = chapter;
        chapterFilter.appendChild(option);
    });
    
    // 유형 드롭다운 옵션 완전히 새로 생성
    typeFilter.innerHTML = '';
    
    // 전체 옵션 먼저 추가
    const allTypeOption = document.createElement('option');
    allTypeOption.value = "전체";
    allTypeOption.textContent = "전체";
    typeFilter.appendChild(allTypeOption);
    
    // 각 유형 옵션 추가 (모든 유형을 명시적으로 추가)
    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = typeLabels[type] || type;
        typeFilter.appendChild(option);
    });
    
    console.log('필터 옵션 생성됨:', {
        '챕터 개수': chapterFilter.options.length,
        '유형 개수': typeFilter.options.length,
        '챕터 목록': chapters,
        '유형 목록': types
    });
}

// 퀴즈 시작 함수 (신규)
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

// 퀴즈 리셋 함수 (신규)
function resetQuiz() {
    // 현재 진행 중인 퀴즈 종료하고 선택 화면으로 돌아가기
    incorrectQuestions = [];
    isReviewMode = false;
    quizStarted = false;
    
    showSelectionScreen();
}

// 필터 적용 함수 수정 (이미지에 맞게 기본값 설정)
function applyFilters() {
    const chapterValue = chapterFilter.value;
    const typeValue = typeFilter.value;
    
    console.log('필터 적용:', { chapter: chapterValue, type: typeValue });
    
    // 필터 로직 수정
    filteredQuestions = questions.filter(question => {
        const chapterMatch = chapterValue === "전체" || question.chapter === chapterValue;
        const typeMatch = typeValue === "전체" || question.type === typeValue;
        return chapterMatch && typeMatch;
    });
    
    console.log(`필터 적용 결과: ${filteredQuestions.length}개 문제 선택됨`);
    
    // 버튼 상태 업데이트
    updateButtonStates();
    updateQuestionCounter();
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
    // 더 강력한 방식으로 헤더 영역 정리
    function cleanupHeader() {
        // 1. 헤더 요소 찾기 (여러 선택자로 시도)
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
        
        // 2. 상단에 있는 모든 select 요소 찾아서 제거 (더 직접적인 접근)
        const topSelects = document.querySelectorAll('body > * select');
        topSelects.forEach(select => {
            // 하단 선택 영역의 select는 제외 (id로 구분)
            if (select.id !== 'chapter-filter' && select.id !== 'type-filter') {
                // 부모 요소까지 찾아가서 제거
                const parent = select.parentElement;
                if (parent) parent.style.display = 'none';
                select.style.display = 'none';
            }
        });
        
        // 3. 강제 CSS 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            /* 상단 영역의 선택기 요소 강제 숨김 */
            body > header select,
            body > header .selector-container,
            body > header label,
            body > header form,
            body > .navbar select,
            body > .navbar .selector-container,
            body > .navbar label,
            body > .navbar form,
            body > div:not(#selection-container):not(#quiz-container) select,
            body > div:not(#selection-container):not(#quiz-container) label {
                display: none !important;
            }
            
            /* 헤더 스타일 정리 */
            header, .navbar {
                padding: 20px 0;
                text-align: center;
                margin-bottom: 30px;
            }
            
            /* 하단 선택기는 유지 */
            #selection-container select,
            #chapter-filter,
            #type-filter {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 헤더 정리 함수 실행
    cleanupHeader();
    
    // 기존 초기화 함수 호출
    init();
});