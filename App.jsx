import { useState } from "react"
import { languages } from "./utils/languages"
import { clsx } from "clsx"
import { getRandomWord } from "./utils/util"
import ReactConfetti from "react-confetti"
import LanguageElements from "./components/LanguageElements"
import LetterElements from "./components/LetterElements"
import Keyboard from "./components/Keyboard"
import GameStatus from "./components/GameStatus"

/**
 * Backlog:
 * 
 * 1. Set a timer on the game that causes a loss if time runs out
 * 
 */

export default function AssemblyEndgame() {

    // State values
    const [currentWord, setCurrentWord] = useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = useState([]) 
    
    // Derived values
    const wrongGuessCount = 
        guessedLetters.filter(letter => !currentWord.includes(letter)).length
    const numGuessesLeft = (languages.length - 1) - wrongGuessCount
    const isGameWon = 
        currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1
    const isGameOver = isGameWon || isGameLost

    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = !currentWord.includes(lastGuessedLetter)
   
    const gameStatusClass = clsx("game-status",
        {
            won: isGameWon,
            lost: isGameLost,
            farewell: !isGameOver && isLastGuessIncorrect && wrongGuessCount>0
        }
    )

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }
    


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
                <h4>{`You have ${numGuessesLeft} guesses remaining`}</h4>
            </header>

            <section
                className={gameStatusClass}
                aria-live="polite" 
                role="status"
            >
                <GameStatus
                    isGameOver={isGameOver}
                    isGameWon={isGameWon}
                    isGameLost={isGameLost}
                    isLastGuessIncorrect={isLastGuessIncorrect}
                    wrongGuessCount={wrongGuessCount}
                />
            </section>

            <section className="language-chips">
                <LanguageElements wrongGuessCount={wrongGuessCount} />
            </section>

            <section className="word">
                <LetterElements
                    word={currentWord}
                    guessedLetters={guessedLetters}
                    isGameLost={isGameLost}
                />
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
                <Keyboard
                    word={currentWord}
                    guessedLetters={guessedLetters}
                    isGameOver={isGameOver}
                    setGuessedLetters={setGuessedLetters}
                />
            </section>
            {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
        </main>
    )
}
