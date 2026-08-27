import { lazy, useEffect, useRef, useState } from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./util"
import ReactConfetti from "react-confetti"

/**
 * Backlog:
 * 
 * ✅ Farewell messages in status section
 * ✅ Disable the keyboard when the game is over
 * ✅ Fix a11y issues
 * ✅ Choose a random word from a list of words
 * ✅ Make the New Game button reset the game
 * - Reveal what the word was if the user loses the game
 * - Confetti drop when the user wins
 * 
 * Challenge: Reveal the missing letters of the word if the user
 * loses the game. Style the missing letters to have the same red
 * color as the wrong letter keys.
 */

export default function AssemblyEndgame() {

    // State values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([]) 
    
    console.log(currentWord)
    // Derived values
    const wrongGuessCount = 
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const numGuessesLeft = languages.length - 1 - wrongGuessCount
    const isGameWon = 
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = !currentWord.includes(lastGuessedLetter)
   

    // Static values
    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const languageElements = languages.map((lang, index) => {
        
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }

        const className = clsx("chip", (index < wrongGuessCount) && "lost")

        return (
            <span
                className={className}
                style={styles}
                key={lang.name}
            >
                {lang.name}
            </span>
        )
    })

    const styleLost = {
        color: "#EC5D49"
    }
    
    const letterElements = currentWord.split("").map((letter, index) => {

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

    
    const keyboardElements = alphabet.split("").map(letter => {

        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = guessedLetters.includes(letter) && currentWord.includes(letter)
        const isWrong = guessedLetters.includes(letter) && !currentWord.includes(letter)
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

    function addGuessedLetter(letter) {
        setGuessedLetters(prevGuessedLetters =>
            prevGuessedLetters.includes(letter) ?
                prevGuessedLetters :
                [...prevGuessedLetters, letter]   
        )
    }

    const gameStatusClass = clsx("game-status",
        {
            won: isGameWon,
            lost: isGameLost,
            farewell: !isGameOver && isLastGuessIncorrect && wrongGuessCount>0
        }
    )

    function renderGameStatus() {
        if (!isGameOver) {
            return wrongGuessCount>0 && isLastGuessIncorrect ?
                
                <>
                    <p className="farewell-message">
                        {getFarewellText(languages[wrongGuessCount - 1].name)}
                    </p>
                </>
                :null
        }

        if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>Well done! 🎉</p>
                </>
            )
        } else {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
    }

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    // console.log(`You have ${numGuessesLeft} attempts left`)

    return (
        <main>
            {
                isGameWon &&
                <ReactConfetti
                    recycle={false}
                    numberOfPieces={1000}
                />
            }
            
            <header>
                <h1>Assembly: Endgame</h1>
                <p>Guess the word within 8 attempts to keep the
                programming world safe from Assembly!</p>
            </header>

            <section
                className={gameStatusClass}
                aria-live="polite" 
                role="status"
            >
                {renderGameStatus()}
            </section>

            <section className="language-chips">
                {languageElements}
            </section>

            <section className="word">
                {letterElements}
            </section>

            
            {/* Combined visually-hidden aria-live region for status updates */}
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>

            <section className="keyboard">
                {keyboardElements}
            </section>
            {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
        </main>
    )
}
