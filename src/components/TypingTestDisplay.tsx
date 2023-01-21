import "../styles/TypingTest.css"


interface IProps{
    wordRow : {value: string, active: boolean, correct: boolean}[][];
    activeRowIndex: React.MutableRefObject<number>;
    activeWordIndex: React.MutableRefObject<number>;
}

const TypingTestDisplay : React.FC<IProps> = (props : IProps) => {

    /**
     * Generates a div containing spans made of word objects
     */
    const generateRow = (row : {value: string, active: boolean, correct: boolean}[], type : string) => {
        return(<div className={type}>
            {row.map((obj, index) => (
                    <span className={`wordContainer${obj.active ? ' active' : ''}${obj.correct ? '' : ' incorrect'}`} key={index}>{obj.value}</span>
                ))}
                </div>)
    }

    return(
        <div id="TextBox">
            {props.wordRow[props.activeRowIndex.current] != undefined ? generateRow(props.wordRow[props.activeRowIndex.current], "ActiveRow") : (<div className="ActiveRow"/>)}
            {props.wordRow[props.activeRowIndex.current + 1] != undefined ? generateRow(props.wordRow[props.activeRowIndex.current + 1], "ReserveRow") : (<div className="ReserveRow"/>)}
        </div>
    )
}

export default TypingTestDisplay;