const questions = [
  {
    chapter: '1장',
    question: "운영체제(Operating System; OS)의 정의는?",
    answer: '컴퓨터 사용자와 컴퓨터 하드웨어 사이에서 중계 역할을 하면서, 프로그램의 실행을 관리하고 제어하는 시스템 소프트웨어',
  },
  {
    chapter: '1장',
    question: "운영체제의 주요 기능 중 CPU를 관리하는 기능은?",
    answer: '프로세스 관리(process management)',
  },
  {
    chapter: '1장',
    question: "운영체제의 주요 기능 중 프로그램이 필요한 메모리를 할당하고 회수하는 기능은?",
    answer: '메모리 관리(memory management)',
  },
  {
    chapter: '1장',
    question: "운영체제가 파일의 생성, 삭제, 저장 위치 등의 정보를 관리하는 기능은?",
    answer: '파일 시스템 관리(file system management)',
  },
  {
    chapter: '1장',
    question: "키보드, 마우스, 디스플레이, 프린터 등의 입출력 장치와 저장장치를 제어하는 운영체제 기능은?",
    answer: '장치 관리(device management)',
  },
  {
    chapter: '1장',
    question: "운영체제가 모든 컴퓨터 자원(resource)을 관리한다는 것은 어떤 역할에 해당하는가?",
    answer: '자원 관리',
  },
  {
    chapter: '1장',
    question: "운영체제의 역할 중 악의적인 사용자나 미숙한 사용자로부터 시스템 자원을 보호하는 것은?",
    answer: '자원 보호',
  },
  {
    chapter: '1장',
    question: "운영체제의 역할 중 사용자가 컴퓨터를 쉽고 편리하게 사용할 수 있도록 사용자 인터페이스를 제공하는 것은?",
    answer: '사용자 인터페이스 제공',
  },
  {
    chapter: '1장',
    question: "운영체제의 유형 중 일반 PC에서 사용되는 대표적인 운영체제는?",
    answer: '윈도우, Mac OS, 리눅스 등',
  },
  {
    chapter: '1장',
    question: "운영체제의 유형 중 스마트폰이나 태블릿에서 사용되는 운영체제는?",
    answer: 'iOS, 안드로이드 등',
  },
  {
    chapter: '1장',
    question: "임베디드 운영체제의 특징은?",
    answer: '작고 가벼운 메모리와 저장 공간을 차지하며, 특정 기기에 맞춰 설계된 운영체제',
  },
  {
    chapter: '1장',
    question: "운영체제는 크게 어떤 두 부분으로 나뉘는가?",
    answer: '커널(kernel)과 인터페이스(interface)',
  },
  {
    chapter: '1장',
    question: "운영체제의 핵심 부분으로, 하드웨어를 직접 제어하는 부분은?",
    answer: '커널(kernel)',
  },
  {
    chapter: '1장',
    question: "사용자가 운영체제를 사용할 수 있도록 명령을 내리는 부분은?",
    answer: '사용자 인터페이스(User Interface; UI)',
  },
  {
    chapter: '1장',
    question: "문자 기반 인터페이스에서 발전한 형태로, 아이콘과 윈도우를 사용하는 직관적인 인터페이스는?",
    answer: '그래픽 사용자 인터페이스(Graphical User Interface; GUI)',
  },
  {
    chapter: '1장',
    question: "하드웨어를 직접 제어하는 기본 소프트웨어로, 보통 ROM이나 플래시 메모리에 저장되어 있는 것은?",
    answer: '펌웨어(firmware)',
  },
  {
    chapter: '1장',
    question: "운영체제의 목표 중 같은 자원으로 더 많은 작업량을 처리하거나, 같은 작업량을 처리하는 데 더 적은 자원을 사용하는 것은?",
    answer: '효율성',
  },
  {
    chapter: '1장',
    question: "운영체제의 목표 중 악의적인 사용자나 프로그램으로부터 시스템과 사용자를 보호하는 것은?",
    answer: '안정성',
  },
  {
    chapter: '1장',
    question: "운영체제의 목표 중 새로운 하드웨어나 소프트웨어에 맞게 기능을 확장할 수 있는 특성은?",
    answer: '확장성',
  },
  {
    chapter: '1장',
    question: "운영체제의 목표 중 사용자가 쉽게 컴퓨터를 사용할 수 있도록 하는 특성은?",
    answer: '편의성',
  },

