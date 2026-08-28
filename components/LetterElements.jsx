import clsx from "clsx"

export default function LetterElements({word, guessedLetters, isGameLost}) {
    return (
        word.split("").map((letter, index) => {
        
            const shouldRevealLetter = guessedLetters.includes(letter) || isGameLost
            const letterClassName = clsx(
                isGameLost && !guessedLetters.includes(letter) && "missed-letter"
            )
            return (
                <span key={index} className={letterClassName}>
                    {shouldRevealLetter ? letter.toUpperCase() : ""}
                </span>
            )
        })
    )
}