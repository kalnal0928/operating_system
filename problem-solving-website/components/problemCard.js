function createProblemCard(problem) {
    return `
        <div class="problem-card">
            <h3>${problem.question}</h3>
            <ul>
                ${problem.options.map(option => `<li>${option}</li>`).join('')}
            </ul>
        </div>
    `;
}

export default createProblemCard;