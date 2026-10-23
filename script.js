const questionBank = [
    {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Text Machine Language", "Home Tool Markup Language", "Hyper Tool Main Language"],
        answer: 0
    },
    {
        question: "Which CSS property changes text color?",
        options: ["font-size", "background", "color", "text-style"],
        answer: 2
    },
    {
        question: "Which tag is used to add an image in HTML?",
        options: ["<picture>", "<img>", "<image>", "<src>"],
        answer: 1
    },
    {
        question: "Which keyword can declare a block-scoped variable in JavaScript?",
        options: ["var", "print", "let", "echo"],
        answer: 2
    },
    {
        question: "Which symbol is used for an ID selector in CSS?",
        options: [".", "#", "*", "@"],
        answer: 1
    },
    {
        question: "Which method displays a message in the browser console?",
        options: ["console.log()", "alert.log()", "print.console()", "show()"],
        answer: 0
    },
    {
        question: "Which Bootstrap class creates a green button?",
        options: ["btn-blue", "btn-success", "button-green", "bg-btn"],
        answer: 1
    },
    {
        question: "Which HTML tag creates a hyperlink?",
        options: ["<link>", "<href>", "<a>", "<url>"],
        answer: 2
    },
    {
        question: "Which CSS property adds space inside an element?",
        options: ["margin", "padding", "border", "display"],
        answer: 1
    },
    {
        question: "Which operator checks strict equality in JavaScript?",
        options: ["=", "==", "===", "!="],
        answer: 2
    }
];

const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");
const optionsBox = document.getElementById("options");
const nextBtn = document.getElementById("nextBtn");

let questions = [];
let currentQuestion = 0;
let score = 0;
let seconds = 15;
let timerId;
let answered = false;
let results = [];

function startQuiz() {
    // Shuffle the question bank and pick 5 questions
    questions = [...questionBank];
    questions.sort(function () {
        return Math.random() - 0.5;
    });
    questions = questions.slice(0, 5);

    currentQuestion = 0;
    score = 0;
    results = [];

    startScreen.classList.add("d-none");
    resultScreen.classList.add("d-none");
    quizScreen.classList.remove("d-none");

    showQuestion();
}

function showQuestion() {
    clearInterval(timerId);
    answered = false;
    seconds = 15;
    nextBtn.disabled = true;
    document.getElementById("feedback").textContent = "";
    document.getElementById("questionCount").textContent =
        "Question " + (currentQuestion + 1) + " / " + questions.length;

    const item = questions[currentQuestion];
    document.getElementById("questionText").textContent = item.question;
    optionsBox.innerHTML = "";

    item.options.forEach(function (option, index) {
        const button = document.createElement("button");
        button.className = "option-btn";
        button.textContent = option;
        button.addEventListener("click", function () {
            checkAnswer(index);
        });
        optionsBox.appendChild(button);
    });

    showProgress();
    updateTimer();
    timerId = setInterval(function () {
        seconds--;
        updateTimer();

        if (seconds <= 0) {
            checkAnswer(-1);
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById("timer").textContent = "Time Left: " + seconds + "s";
}

function showProgress() {
    const progressBar = document.getElementById("progressBar");
    const colors = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#6f42c1"];
    progressBar.innerHTML = "";

    for (let i = 0; i < questions.length; i++) {
        const piece = document.createElement("div");
        piece.className = "progress-piece";

        if (i <= currentQuestion) {
            piece.style.backgroundColor = colors[i];
        }

        progressBar.appendChild(piece);
    }
}

function checkAnswer(selectedIndex) {
    if (answered) {
        return;
    }

    answered = true;
    clearInterval(timerId);

    const item = questions[currentQuestion];
    const buttons = optionsBox.querySelectorAll("button");
    const isCorrect = selectedIndex === item.answer;

    if (isCorrect) {
        score++;
    }

    buttons.forEach(function (button, index) {
        button.disabled = true;

        if (index === item.answer) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("wrong");
        }
    });

    results.push({
        question: item.question,
        chosen: selectedIndex === -1 ? "Not answered" : item.options[selectedIndex],
        correct: item.options[item.answer],
        status: isCorrect ? "Correct" : "Incorrect"
    });

    const feedback = document.getElementById("feedback");
    feedback.textContent = isCorrect ? "Correct answer!" : "Correct answer: " + item.options[item.answer];
    nextBtn.disabled = false;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? "Show Result" : "Next Question →";
}

function nextQuestion() {
    if (!answered) {
        return;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    clearInterval(timerId);
    quizScreen.classList.add("d-none");
    resultScreen.classList.remove("d-none");
    document.getElementById("scoreText").textContent = "Your Score: " + score + " / " + questions.length;
    document.getElementById("resultMessage").textContent =
        score >= 3 ? "Good job! Keep practicing." : "Keep learning and try again!";
}

function downloadPDF() {
    if (!window.jspdf) {
        alert("PDF library could not load. Please check your internet connection.");
        return;
    }

    const jsPDF = window.jspdf.jsPDF;
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Quick Quiz - Result", 15, 20);
    pdf.setFontSize(12);
    pdf.text("Score: " + score + " / " + questions.length, 15, 32);

    let y = 45;

    results.forEach(function (item, index) {

        const lines = [
            (index + 1) + ". " + item.question,
            "Your answer: " + item.chosen,
            "Correct answer: " + item.correct,
            "Status: " + item.status
        ];

        lines.forEach(function (line) {
            const wrappedLines = pdf.splitTextToSize(line, 175);
            const height = wrappedLines.length * 6;

            if (y + height > 280) {
                pdf.addPage();
                y = 20;
            }

            pdf.text(wrappedLines, 15, y);
            y += height + 2;
        });

        y += 5;
    });

    pdf.save("Quiz_Result.pdf");
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    const darkMode = document.body.classList.contains("dark");
    document.getElementById("themeBtn").textContent = darkMode ? "Light Mode" : "Dark Mode";
}

document.getElementById("startBtn").addEventListener("click", startQuiz);
document.getElementById("restartBtn").addEventListener("click", startQuiz);
document.getElementById("themeBtn").addEventListener("click", toggleTheme);
document.getElementById("downloadBtn").addEventListener("click", downloadPDF);
nextBtn.addEventListener("click", nextQuestion);
