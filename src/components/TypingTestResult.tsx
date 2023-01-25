import "../styles/TypingTest.css"

interface IProps{
    result : {
        correctInputs : number,
        incorrectInputs : number,
        correctWords : number,
        incorrectWords : number,
        correctWordsCharCount: number
        }
}

const TypingTestResult : React.FC<IProps> = (props : IProps) =>{

    return (
        <div className="resultBox">
            <div>
                <h1>Result</h1>
            </div>
            <div>
                <p>Words per minute</p>
                <p>{props.result.correctWordsCharCount / 5}</p>
            </div>
            <div>
                <p>Accuraccy</p>
                <p>{(props.result.correctInputs / (props.result.correctInputs + props.result.incorrectInputs))}%</p>
            </div>
            <div>
                <p>Keystrokes</p>
                <p>
                    ( <span className="greenText">{props.result.correctInputs}</span> | <span className="redText">{props.result.incorrectInputs}</span> ) {props.result.correctInputs + props.result.incorrectInputs}
                </p>
            </div>
            <div>
                <p>Correct words</p>
                <p className="greenText">{props.result.correctWords}</p>
            </div>
            <div>
                <p>Wrong words</p>
                <p className="redText">{props.result.incorrectWords}</p>
            </div>
        </div>
    )
}

export default TypingTestResult;