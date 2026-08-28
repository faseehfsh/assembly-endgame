import clsx from "clsx"

export default function Keyboard({word, guessedLetters, isGameOver, setGuessedLetters}) {

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const styleLost = {
        color: "#EC5D49"
    }

    function addGuessedLetter(letter) {
        setGuessedLetters(prevGuessedLetters =>
            prevGuessedLetters.includes(letter) ?
                prevGuessedLetters :
                [...prevGuessedLetters, letter]   
        )
    }

    return (
        alphabet.split("").map(letter => {
        
            const isGuessed = guessedLetters.includes(letter)
            const isCorrect = isGuessed && word.includes(letter)
            const isWrong = isGuessed && !word.includes(letter)
            const className = clsx({
                        correct: isCorrect,
                        wrong: isWrong
                })
            
    
            return (
                <button key={letter}
                    value={letter}
                    onClick={() => addGuessedLetter(letter)}
                    className={className}
                    disabled={isGameOver}
                    aria-disabled={guessedLetters.includes(letter)}
                    aria-label={`Letter ${letter}`}
                >
                    {letter.toUpperCase()}
                </button>
            )
        })
    )
}