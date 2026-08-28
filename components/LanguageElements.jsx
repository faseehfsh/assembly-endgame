import clsx from "clsx"
import { languages } from "../utils/languages"

export default function LanguageElements(props) {
    return (
        languages.map((lang, index) => {
                
            const styles = {
                backgroundColor: lang.backgroundColor,
                color: lang.color
            }
    
            const className = clsx("chip", (index < props.wrongGuessCount) && "lost")
    
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
    )
}
