import clsx from "clsx"
import { getFarewellText } from "../utils/util"
import { languages } from "../utils/languages"

export default function GameStatus({isGameOver, isGameWon, isLastGuessIncorrect, wrongGuessCount}) {
    
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