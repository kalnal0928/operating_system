const questions = [
    // 1장 연습문제 - 객관식
    {
        number: "04",
        question: "운영체제의 구성 요소가 아닌 것은?",
        options: ["유틸리티", "GUI", "드라이버", "커널"],
        answer: "유틸리티",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "05",
        question: "나머지 셋과 종류가 다른 것은?",
        options: ["드라이버", "GUI", "셸", "명령 프롬프트"],
        answer: "드라이버",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "06",
        question: "운영체제의 핵심 기능을 모아 놓은 것은?",
        options: ["유틸리티", "사용자 인터페이스", "디바이스 드라이버", "커널"],
        answer: "커널",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "09",
        question: "키보드와 모니터가 발명되면서 실현 가능하게 된 시스템은?",
        options: ["대화형 시스템", "일괄 작업 시스템", "시분할 시스템", "실시간 시스템"],
        answer: "대화형 시스템",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "10",
        question: "CPU 시간을 잘게 나누어 여러 프로그램이 동시에 실행되는 것처럼 보이는 시스템은?",
        options: ["hard wiring system", "batch job system", "time sharing system", "real-time system"],
        answer: "time sharing system",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "12",
        question: "언제 어디서나 컴퓨팅 파워나 소프트웨어에 접근할 수 있는 유연한 컴퓨터 환경을 위해 고안된 시스템은?",
        options: ["real-time system", "cloud computing", "P2P system", "Internet of Things"],
        answer: "cloud computing",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "13",
        question: "사용자가 커널에 진입할 수 있는 유일한 수단은?",
        options: ["시스템 호출", "사용자 정의 함수", "디바이스 드라이버", "사용자 인터페이스"],
        answer: "시스템 호출",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "14",
        question: "응용 프로그램이 자신과 연관된 프로그램을 만들 수 있도록 제공하는 인터페이스는?",
        options: ["interface", "API", "shell", "kernel"],
        answer: "API",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "15",
        question: "프로그램 개발자를 위해 API, 코드 편집기, 에뮬레이터 같은 각종 개발용 응용 프로그램까지 하나로 묶어서 배포하는 개발 툴은?",
        options: ["SDK", "시스템 호출", "드라이버", "커널"],
        answer: "SDK",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "16",
        question: "커널과 하드웨어의 인터페이스를 가리키는 것은?",
        options: ["SDK", "system call", "driver", "API"],
        answer: "driver",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "18",
        question: "비슷한 기능을 가진 모듈을 묶어서 하나의 계층으로 만들고, 계층 간 통신을 통해 운영체제를 구현하는 방식의 커널은?",
        options: ["micro architecture kernel", "wide architecture kernel", "layered architecture kernel", "monolithic architecture kernel"],
        answer: "layered architecture kernel",
        chapter: "1장",
        type: "multiple-choice"
    },
    {
        number: "20",
        question: "서로 다른 운영체제에서 동일한 작업 환경을 만들어 주는 것은?",
        options: ["객체지향", "컴파일러", "가상머신", "인터프리터"],
        answer: "가상머신",
        chapter: "1장",
        type: "multiple-choice"
    },

    // 1장 연습문제 - 주관식 (빈칸 채우기)
    {
        number: "21",
        question: "(   _____     )는 컴퓨터 전체를 관리하고 운영하는 소프트웨어다.",
        answer: "운영체제",
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "23",
        question: "(    _____      )은 CPU 성능이 낮고 메모리 크기가 작은 기계에 탑재된 컴퓨터다.",
        answer: ["임베디드 컴퓨터", "임베디드 시스템", "임베디드컴퓨터", "임베디드시스템"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "26",
        question: "(    _____     )은 운영체제의 핵심 기능을 모아 놓은 것이다.",
        answer: "커널",
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "29",
        question: "(   _____    )은 키보드와 모니터가 발명되면서 실현 가능하게 된 시스템이다.",
        answer: ["대화형 시스템", "대화형시스템"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "30",
        question: "(  _____   )은 CPU 시간을 잘게 나누어 여러 프로그램이 동시에 실행되는 것처럼 보이는 시스템이다.",
        answer: ["시분할 시스템", "시분할시스템"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "33",
        question: "사용자가 자발적으로 커널에 진입할 수 있는 유일한 방법은 (   _____   )뿐이다.",
        answer: ["시스템 호출", "시스템호출"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "34",
        question: "(    _____   )는 응용 프로그램이 자신과 연관된 프로그램을 만들 수 있도록 제공하는 인터페이스다.",
        answer: ["API", "api"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "37",
        question: "(     _____    )은 핵심 기능을 구현하는 모듈이 구분 없이 하나로 구성된 커널이다.",
        answer: ["단일형 구조 커널", "단일형구조커널", "단일형"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "38",
        question: "(   _____   )은 비슷한 기능을 가진 모듈을 묶어서 하나의 계층으로 만들고, 계층 간의 통신을 통해 운영체제를 구현하는 방식의 커널이다.",
        answer: ["계층형 구조 커널", "계층형구조커널", "계층형"],
        chapter: "1장",
        type: "fill-in-blank"
    },
    {
        number: "39",
        question: "(    _____    )은 프로세스 관리, 메모리 관리, 프로세스 간 통신 관리 등 가장 기본 기능만 제공하는 커널이다.",
        answer: ["마이크로 구조 커널", "마이크로구조커널", "마이크로형"],
        chapter: "1장",
        type: "fill-in-blank"
    },

    // 1장 연습문제 - 서술형
    {
        number: "42",
        question: "시분할 시스템에 대하여 설명하시오.",
        answer: "CPU로 여러 작업을 동시에 실행하는 기술인 멀티프로그래밍 기술을 통해 CPU 사용 시간을 잘게 쪼개어 여러 작업에 나누어 줌으로써 모든 작업을 동시에 처리하는 것처럼 보이게 하는 것.",
        chapter: "1장",
        type: "essay"
    },

    // 3장 연습문제 - 객관식
    {
        number: "01",
        question: "실행을 위해 메모리에 올라온 동적인 상태를 가리키는 것은?",
        options: ["소스코드", "프로세스", "프로그램", "PCB"],
        answer: "프로세스",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "02",
        question: "프로세스를 실행하는 데 필요한 정보를 보관하는 자료구조는?",
        options: ["stack", "PC", "queue", "PCB"],
        answer: "PCB",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "03",
        question: "프로세스가 CPU를 할당받기 전에 기다리는 상태는?",
        options: ["실행 상태", "준비 상태", "대기 상태", "생성 상태"],
        answer: "준비 상태",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "04",
        question: "실행 상태의 프로세스가 입출력을 요구하면 이동하는 상태는?",
        options: ["완료 상태", "준비 상태", "대기 상태", "생성 상태"],
        answer: "대기 상태",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "05",
        question: "대기 상태의 프로세스가 입출력이 완료되면 이동하는 상태는?",
        options: ["실행 상태", "준비 상태", "완료 상태", "생성 상태"],
        answer: "준비 상태",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "06",
        question: "실행 상태의 프로세스가 작업이 안 끝났음에도 타임 슬라이스 아웃이 걸려 이동하게 되는 상태는?",
        options: ["완료 상태", "준비 상태", "대기 상태", "생성 상태"],
        answer: "준비 상태",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "09",
        question: "두 프로세스의 PCB를 교환하고 작업 환경을 바꾸는 작업은?",
        options: ["활성 상태", "다단계 큐", "다중 인스턴스", "문맥 교환"],
        answer: "문맥 교환",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "10",
        question: "타임 슬라이스의 크기를 정할 때 기준이 되는 것은?",
        options: ["문맥 교환", "다단계 큐", "다중 인스턴스", "활성 상태"],
        answer: "문맥 교환",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "11",
        question: "유닉스에서 프로세스 번호 1번이면서 모든 프로세스의 최고 조상에 해당하는 프로세스의 이름은?",
        options: ["init", "login", "shell", "swapper"],
        answer: "init",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "12",
        question: "새로운 프로세스를 생성하는 함수는?",
        options: ["wait()", "fork()", "exit()", "exec()"],
        answer: "fork()",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "13",
        question: "프로세스는 그대로 놔둔 채 코드를 바꾸는 함수는?",
        options: ["wait()", "fork()", "exit()", "exec()"],
        answer: "exec()",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "14",
        question: "프로세스의 재사용과 가장 연관이 깊은 함수는?",
        options: ["wait()", "fork()", "exit()", "exec()"],
        answer: "exec()",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "15",
        question: "자식 프로세스가 종료되기 전에 부모 프로세스가 먼저 종료되면 자식 프로세스는 어떤 프로세스가 되는가?",
        options: ["init 프로세스", "zombi 프로세스", "orphan 프로세스", "swapper 프로세스"],
        answer: "orphan 프로세스",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "16",
        question: "자식 프로세스가 종료되었는데도 부모가 뒤처리를 하지 않으면 자식 프로세스는 어떤 프로세스가 되는가?",
        options: ["init 프로세스", "좀비 프로세스", "고아 프로세스", "swapper 프로세스"],
        answer: "좀비 프로세스",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "18",
        question: "코드에 정의된 절차에 따라 CPU에 작업을 요청하는 실행 단위는?",
        options: ["태스크", "작업", "프로세스", "스레드"],
        answer: "스레드",
        chapter: "3장",
        type: "multiple-choice"
    },
    {
        number: "19",
        question: "멀티스레드의 장점이 아닌 것은?",
        options: ["스레드끼리 독립적이라 영향을 받지 않는다.", "응답 속도가 빨라진다.", "프로세스에 비하여 통신 오버헤드가 적다.", "시스템 자원을 공유한다."],
        answer: "스레드끼리 독립적이라 영향을 받지 않는다.",
        chapter: "3장",
        type: "multiple-choice"
    },

    // 3장 연습문제 - 주관식 (빈칸 채우기)
    {
        number: "21",
        question: "프로세스 제어 블록(PCB)은 (      _____      ) 영역에 만들어진다.",
        answer: "운영체제",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "22",
        question: "메모리에 있는 프로세스는 코드, 데이터, (       _____       ) 영역으로 나뉜다.",
        answer: "스택",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "23",
        question: "프로세스 상태 중 (      _____       ) 상태는 프로세스가 CPU를 할당받기 전에 기다리는 상태다.",
        answer: "준비",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "24",
        question: "프로세스 상태 중 (        _____      ) 상태는 컴퓨터의 효율성을 높이기 위하여 만들어진 상태다.",
        answer: "대기",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "25",
        question: "프로세스 상태 중 (     _____         ) 상태는 실행 상태의 프로세스가 입출력을 요구하면 이동하는 상태다.",
        answer: "대기",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "26",
        question: "프로세스 상태 중 (       _____       ) 상태는 대기 상태의 프로세스가 입출력이 완료되면 이동하는 상태다.",
        answer: "준비",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "27",
        question: "프로세스 상태 중 (       _____       ) 상태는 실행 상태의 프로세스가 작업이 안 끝났음에도 타임 슬라이스 아웃이 걸려 이동하게 되는 상태다.",
        answer: "준비",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "30",
        question: "(       _____     )은 두 프로세스의 PCB를 교환하고 작업 환경을 바꾸는 작업이다.",
        answer: ["문맥 교환", "문맥교환"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "33",
        question: "유닉스에서 프로세스 번호 1번이면서 모든 프로세스의 최고 조상 프로세스에 해당하는 프로세스의 이름은 (    _____          )이다.",
        answer: ["init 프로세스", "init프로세스", "init"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "34",
        question: "(      _____        )는 새로운 프로세스를 생성하는 함수다.",
        answer: "fork()",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "35",
        question: "(      _____        )는 프로세스는 그대로 놔둔 채 코드를 바꾸는 함수다.",
        answer: "exec()",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "36",
        question: "(        _____     )는 다중 인스턴스를 만들 때 사용하는 함수다.",
        answer: "fork()",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "37",
        question: "(      _____        )는 프로세스의 재사용과 가장 연관이 깊은 함수다.",
        answer: "exec()",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "41",
        question: "자식 프로세스가 종료되기 전에 부모 프로세스가 먼저 종료되면 자식 프로세스는 (    _____          )가 된다.",
        answer: ["고아 프로세스", "고아프로세스", "orphan 프로세스", "orphan프로세스"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "42",
        question: "자식 프로세스가 종료되었는데도 부모가 뒤처리를 하지 않으면 자식 프로세스는 (   _____           )가 된다.",
        answer: ["좀비 프로세스", "좀비프로세스", "zombi 프로세스", "zombiprocess"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "43",
        question: "fork() 이후에 부모 프로세스에 wait()가 없으면 (    _____          ) 프로세스가 만들어진다.",
        answer: ["고아 프로세스", "고아프로세스", "orphan 프로세스", "orphan프로세스", " 고아"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "46",
        question: "(     _____         )는 프로그램이 실행을 위해 메모리에 올라온 동적 상태를 말한다.",
        answer: "프로세스",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "47",
        question: "(     _____          )는 프로세스를 실행하는 데 필요한 정보를 보관하는 자료구조다.",
        answer: ["프로세스 제어 블록(PCB, process control block)", "프로세스제어블록(PCB, process control block)", "process control block(PCB)", "pcb"],
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "50",
        question: "(       _____       )는 정의된 절차에 따라 CPU에 작업을 요청하는 실행 단위를 말한다.",
        answer: "스레드",
        chapter: "3장",
        type: "fill-in-blank"
    },
    {
        number: "51",
        question: "(     _____         )는 프로세스에서 자원을 공유하고 실행 단위만 여러 개 만드는 것을 말한다.",
        answer: ["멀티스레드", "멀티 스레드"],
        chapter: "3장",
        type: "fill-in-blank"
    },

    // 3장 연습문제 - 서술형
    {
        number: "54",
        question: "PCB에 대하여 설명하시오.",
        answer: "프로세스 제어 블록(PCB, Process Control Block)은 프로세스를 실행하기 위한 프로세스 구분자, 메모리 관련 정보, 프로그램 카운터와 각종 레지스터 같은 중간값을 관리하고 보관하는 데이터 구조이다. 프로그램이 프로세스가 되려면 메모리에 올라오는 것과 동시에 프로세스 제어 블록이 생성되어야 한다.",
        chapter: "3장",
        type: "essay"
    },
    {
        number: "55",
        question: "프로세스의 다섯 가지 상태에 대하여 설명하시오.",
        answer: "프로세스의 다섯 가지 상태로는 생성, 준비, 실행, 대기, 완료가 있다. 프로그램이 프로세스가 되며 PCB가 생성되는 생성 상태, 생성된 프로세스가 CPU 자원을 받기 위해 기다리는 준비 상태, 프로세스가 CPU 자원을 할당받아 작업을 수행하는 실행 상태, 입출력 등의 이유로 잠시 기다리는 대기 상태, 작업이 완료되어 PCB가 폐기되는 완료 상태가 있다.",
        chapter: "3장",
        type: "essay"
    },

    // 4장 연습문제 - 객관식
    {
        number: "04",
        question: "비선점형 스케줄링과 비교한 선점형 스케줄링에 대한 설명으로 옳지 않은 것은?",
        options: ["비선점형에 비하여 우선순위가 낮다", "실행 상태에 있는 작업을 중단시키고 새로운 작업을 실행할 수 있다.", "문맥 교환의 오버헤드가 많다.", "시분할 방식 스케줄러에 사용된다."],
        answer: "비선점형에 비하여 우선순위가 낮다",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "05",
        question: "나머지 3개와 비교하여 우선순위가 높은 프로세스는?",
        options: ["일괄 처리 프로세스", "사용자 프로세스", "커널 프로세스", "CPU 집중 프로세스"],
        answer: "커널 프로세스",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "06",
        question: "준비 큐에 도착한 순서대로 CPU를 할당하는 비선점형 방식의 스케줄링 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "최단 작업 우선(SJF)", "최소 잔류 시간 우선(SRT)", "선입선출(FCFS)"],
        answer: "선입선출(FCFS)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "07",
        question: "준비 큐에 있는 프로세스 중에서 실행 시간이 가장 짧은 작업부터 CPU를 할당하는 비선점형 방식의 스케줄링 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "최단 작업 우선(SJF)", "최소 잔류 시간 우선(SRT)", "선입선출(FCFS)"],
        answer: "최단 작업 우선(SJF)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "08",
        question: "아사 현상이 발생할 수 있는 비선점형 방식의 스케줄링 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "최단 작업 우선(SJF)", "최소 잔류 시간 우선(SRT)", "선입선출(FCFS)"],
        answer: "최단 작업 우선(SJF)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "09",
        question: "서비스를 받기 위해 기다린 시간과 CPU 사용 시간을 고려하여 스케줄링하는 비선점형 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "다단계 피드백 큐(MLFQ)", "최소 잔류 시간 우선(SRT)", "선입선출(FCFS)"],
        answer: "최고 응답률 우선(HRN)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "10",
        question: "선점형 알고리즘이 아닌 것은?",
        options: ["다단계 큐(MLQ)", "다단계 피드백 큐(MLFQ)", "라운드 로빈(RR)", "최단 작업 우선(SJF)"],
        answer: "최단 작업 우선(SJF)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "11",
        question: "아사 현상을 완화하는 방법은?",
        options: ["사이클 훔치기", "에이징", "작업 훔치기", "우선순위"],
        answer: "에이징",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "12",
        question: "선입선출(FCFS) 스케줄링과 유사하지만, 각 프로세스마다 CPU를 사용할 수 있는 타임 슬라이스가 있으며 우선순위가 없는 알고리즘은?",
        options: ["다단계 큐(MLQ)", "다단계 피드백 큐(MLFQ)", "라운드 로빈(RR)", "최단 작업 우선(SJF)"],
        answer: "라운드 로빈(RR)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "13",
        question: "문맥 교환 시간을 소비하는 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "최단 작업 우선(SJF)", "다단계 큐(MLQ)", "선입선출(FCFS)"],
        answer: "다단계 큐(MLQ)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "14",
        question: "기본적으로 라운드 로빈 스케줄링을 사용하지만, CPU를 할당받을 프로세스를 선택할 때 남은 작업 시간이 가장 적은 프로세스를 선택하는 알고리즘은?",
        options: ["최고 응답률 우선(HRN)", "다단계 피드백 큐(MLFQ)", "최소 잔류 시간 우선(SRT)", "선입선출(FCFS)"],
        answer: "최소 잔류 시간 우선(SRT)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "16",
        question: "우선순위에 따라 여러 개의 큐를 사용하는 알고리즘 중 고정 우선순위 방식은?",
        options: ["선입선출(FCFS)", "다단계 피드백 큐(MLFQ)", "다단계 큐(MLQ)", "최고 응답률 우선(HRN)"],
        answer: "다단계 큐(MLQ)",
        chapter: "4장",
        type: "multiple-choice"
    },
    {
        number: "18",
        question: "우선순위에 따라 여러 개의 큐를 사용하고 각 큐의 타임 슬라이스 크기가 다른 변동 우선순위 알고리즘은?",
        options: ["선입선출(FCFS)", "다단계 피드백 큐(MLFQ)", "다단계 큐(MLQ)", "최고 응답률 우선(HRN)"],
        answer: "다단계 피드백 큐(MLFQ)",
        chapter: "4장",
        type: "multiple-choice"
    },
    
    // 4장 연습문제 - 주관식 (빈칸 채우기)
    {
        number: "24",
        question: "비선점형과 선점형 스케줄링 중 실행 상태에 있는 작업을 중단시키고 새로운 작업을 실행할 수 있는 것은 (  _____            )이다.",
        answer: ["선점형 스케줄링", "선점형", "선점"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "25",
        question: "비선점형과 선점형 스케줄링 중 실행 상태에 있는 작업이 완료될 때까지 다른 작업이 불가능한 것은 (      _____        )이다.",
        answer: ["비선점형 스케줄링", "비선점형", "비선점"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "26",
        question: "입출력 집중 프로세스보다 CPU 집중 프로세스의 우선순위가 (       _____       ).",
        answer: "낮다",
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "27",
        question: "커널 프로세스의 우선순위가 사용자 프로세스보다 (       _____       ).",
        answer: "높다",
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "28",
        question: "후면 프로세스보다 전면 프로세스의 우선순위가 (         _____     ).",
        answer: "높다",
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "29",
        question: "일괄 처리 프로세스보다 대화형 프로세스의 우선순위가 (     _____         ).",
        answer: "높다",
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "32",
        question: "(       _____        ) 스케줄링은 콘보이 효과가 발생하는 스케줄링 알고리즘이다.",
        answer: ["선입선출(FCFS)", "선입 선출", "선입선출", "fcfs"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "33",
        question: "(      _____         ) 스케줄링은 준비 큐에 있는 프로세스 중에서 실행 시간이 가장 짧은 작업부터 CPU를 할당하는 비선점형 방식의 스케줄링 알고리즘이다.",
        answer: ["최단 작업 우선(SJF)", "최단작업우선", "최단 작업 우선", "sjf"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "34",
        question: "(      _____         )은 최단 작업 우선(SJF)과 같은 알고리즘에서 긴 작업이 계속 뒤로 밀리는 것을 말한다.",
        answer: ["아사(starvation) 현상", "아사현상", "아사 현상", ],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "35",
        question: "(     _____          ) 스케줄링은 서비스를 받기 위해 기다린 시간과 CPU 사용 시간을 고려하여 스케줄링하는 비선점형 알고리즘이다.",
        answer: ["최고 응답률 우선(HRN)", "최고응답률우선", "최고 응답률 우선", "hrn"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "36",
        question: "(     _____          ) 스케줄링은 선점형 알고리즘 중 우선순위가 적용되지 않는 가장 단순하고 대표적인 방식의 알고리즘이다.",
        answer: ["라운드 로빈(RR)", "라운드 로빈", "라운드로빈"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "37",
        question: "(  _____             )은 아사 현상을 완화하는 방법이다.",
        answer: ["에이징(나이 먹기, aging)", "에이징", "나이 먹기", "aging"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "38",
        question: "(    _____           ) 스케줄링은 선입선출(FCFS) 스케줄링과 유사하지만, 각 프로세스마다 CPU를 사용할 수 있는 타임 슬라이스가 있으며 우선순위가 없는 알고리즘이다.",
        answer: ["라운드 로빈(RR)", "라운드 로빈", "라운드로빈"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "39",
        question: "(     _____          ) 스케줄링은 최단 작업 우선(SJF)과 라운드 로빈(RR) 스케줄링을 혼합한 선점형 알고리즘이다.",
        answer: ["최소 잔류 시간 우선(SRT)", "최소잔류시간우선", "최소 잔여 시간 우선", "srt"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "40",
        question: "(     _____          ) 스케줄링은 우선순위에 따라 여러 개의 큐를 사용하는 알고리즘 중 고정 우선순위 방식의 알고리즘이다.",
        answer: ["다단계 큐(MLQ)", "다단계큐", "다단계 큐", "mlq"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "41",
        question: "(    _____           ) 스케줄링은 기본적으로 라운드 로빈 스케줄링을 사용하지만, CPU를 할당받을 프로세스를 선택할 때 남은 작업 시간이 가장 적은 프로세스를 선택하는 알고리즘이다.",
        answer: ["최소 잔류 시간 우선(SRT)", "최소잔류시간우선", "최소 잔여 시간 우선", "srt"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    {
        number: "42",
        question: "(     _____          ) 스케줄링은 우선순위에 따라 여러 개의 큐를 사용하고 각 큐의 타임 슬라이스 크기가 다른 변동 우선순위 알고리즘이다.",
        answer: ["다단계 피드백 큐(MLFQ)", "다단계피드백큐", "다단계 피드백 큐", "mlfq", "다단계피드백 큐"],
        chapter: "4장",
        type: "fill-in-blank"
    },
    
    // 4장 연습문제 - 서술형
    {
        number: "48",
        question: "최단 작업 우선(SJF) 스케줄링과 에이징에 대하여 설명하시오.",
        answer: "최단 작업 우선순위(SJF) 스케줄링은 작업 시간이 짧은 프로세스에 우선순위를 두어 콘보이 효과를 완화할 수 있는 스케줄링 방식이다. SJF 스케줄링에서는 아사 현상이 발생할 수 있는데, 이를 해결하는 방법으로 에이징 방식을 사용한다. 에이징은 프로세스가 자신의 순서를 양보할 때마다 한 살식 먹으며, 프로세스가 양보할 수 있는 상한선에 도달했을 때 우선순위에 상관 없이 실행되는 것이다.",
        chapter: "4장",
        type: "essay"
    },
    {
        number: "49",
        question: "다단계 피드백 큐 스케줄링에 대하여 설명하시오.",
        answer: "다단계 피드백 큐는 우선순위가 낮은 프로세스가 불리한 다단계 큐의 단점을 보완한 스케줄링 방식으로, 프로세스가 실행될 때마다 우선순위가 한 단계씩 낮아진다. 우선순위가 무한대로 낮아져 최하단 우선순위 단계에 도달하면 선입선출(FCFS) 스케줄링 방식으로 동작하여 무조건 프로세스가 실행되도록 한다.",
        chapter: "4장",
        type: "essay"
    }
];

export default questions;
