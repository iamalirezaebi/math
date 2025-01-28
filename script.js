document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameType = card.dataset.game;
            navigateToGame(gameType);
        });
    });
    
    function navigateToGame(gameType) {
        const gameUrls = {
            'hanoi': 'game1/index.html',
            'sudoku': 'game2/index.html',
            '8queens': 'game3/index.html'
        };
        
        if (gameUrls[gameType]) {
            // Add a smooth transition effect
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = gameUrls[gameType];
            }, 300);
        }
    }
});