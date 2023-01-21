import React, {useEffect, useState, useRef} from 'react';
import randomWords from 'random-words';
import TypingTestDisplay from './TypingTestDisplay';

interface IWords {
    wordRow : {value: string, active: boolean, correct: boolean}[][];
    activeWord: {value: string, active: boolean, correct: boolean};
}

const TypingTest : React.FC = () => {

    const [wordRows, setWordRows] = useState<IWords['wordRow']>([[{value: "", active: false, correct: true}]]);
    const activeRowIndex = useRef<number>(0);
    const activeWordIndex = useRef<number>(0);
    const activeWord = useRef<IWords['activeWord']>(wordRows[activeRowIndex.current][activeWordIndex.current]);
    
    const [currentInput, setCurrentInput] = useState<string>("");
    const inputField = useRef<HTMLInputElement>(null);

    const [countdown, setCountdown] = useState<number>(60);
    const [isCounting, setIsCounting] = useState<boolean>(false);
    const countdownInterval = useRef<NodeJS.Timer>();

    const correctInputs = useRef<number>(0);
    const incorrectInputs = useRef<number>(0);
    const correctWords = useRef<number>(0);
    const incorrectWords = useRef<number>(0);
    const correctWordCharCount = useRef<number>(0);

    /**
     * Retrieves 350 random words and generates an array of rows containing word objects.
     * each row contains a list of words that have a combined character count of under 60.
     */
    const generateRows = () : void =>{

        const wordList : string[] = randomWords(350);

        let row : IWords["wordRow"] = [];
        row[0] = [];
        
        let charCount : number = 0;
        let i : number = 0;

        for(let word of wordList){
            charCount += word.length;
            if(charCount < 60){
                const obj = {value : word, active: false, correct : true};
                row[i].push(obj);
            }else{
                i++;
                charCount = word.length;
                const obj = {value : word, active: false, correct : true};
                row[i] = [];
                row[i].push(obj);
            }
        }
        setWordRows(row);
    }


    /**
     * Scrolls through the Word rows updating active word index, active row index and the current active word
     */
    const changeActiveWord = () => {
        activeWord.current.active = false;
        if(activeWordIndex.current < wordRows[activeRowIndex.current].length - 1){
            activeWordIndex.current++;
            activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
        }else{
            activeRowIndex.current++;
            activeWordIndex.current = 0;
            activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
        }
        activeWord.current.active = true;
    }


    /**
     * if user inputs a space, active word is changed and input field is reset
     * @param event Keyboard event
     */
    const handleInput = (event : React.KeyboardEvent<HTMLInputElement>) : void =>{
        if(event.key === " "){     
            setCurrentInput("");
            changeActiveWord();
        }
        if(!isCounting){
            startCountdown();
        }
    }

    /**
     * Updates inputfields state and updats the correct boolean on the active word based on input.
     * Also records correct/incorrect inputs
     * @param event Inputfield change event
     */
    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) : void =>{
        setCurrentInput(event.target.value);
        if(event.target.value.endsWith(" ")){
            const correct = (activeWord.current.value + " " == event.target.value);
            activeWord.current.correct = correct;
            correct ? correctWords.current++ : incorrectWords.current++;
            if(correct) correctWordCharCount.current += event.target.value.length - 1;
        }else{
            const correct = activeWord.current.value.startsWith(event.target.value);
            activeWord.current.correct = correct;
            correct ? correctInputs.current++ : incorrectInputs.current++;
        }
    }

    /**
     * When user focuses the input field the active word is initialized.
     */
    const initializeActiveWord = () =>{
        activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
        activeWord.current.active = true;
    }

    /**
     * Starts a countdown from 60 seconds to 0.
     * once the countdown hits 0 the test is stopped.
     */
    const startCountdown = () =>{
        setIsCounting(true);
        countdownInterval.current = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 0) {
                stopTest();
                return 0;
              }
              return prevCountdown - 1;
            });
          }, 1000);
    }

    /**
     * Stops the countdown, displays the results and initializes the test again.
     */
    const stopTest = () =>{
        clearInterval(countdownInterval.current);
        setIsCounting(false);
        console.log(correctWords.current, correctWordCharCount.current);
        console.log("WPM : " + (correctWordCharCount.current / 5 ) );
        initializeTest();
    }

    /**
     * Initializes the test and timer.
     */
    const initializeTest = () =>{
        if(inputField.current != null) inputField.current.blur();
        setCurrentInput("");
        generateRows();
        setCountdown(60);
        correctInputs.current = 0;
        incorrectInputs.current = 0;
        correctWords.current = 0;
        incorrectWords.current = 0;
        correctWordCharCount.current = 0;
    }

    useEffect(() =>{
        generateRows();
    }, [])


    return (
        <div>
            <TypingTestDisplay wordRow={wordRows} activeRowIndex={activeRowIndex} activeWordIndex={activeWordIndex}/>
            <div>
                <input type="text" value={currentInput} onKeyUp={event => handleInput(event)} onChange={event => handleChange(event)} onFocus={initializeActiveWord} ref={inputField}/>
                <button onClick={stopTest}>Restart</button>
                <div>{countdown}</div>
            </div>
        </div>
    )
}

export default TypingTest;