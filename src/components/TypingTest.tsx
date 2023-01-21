import React, {useEffect, useState, useRef} from 'react';
import randomWords from 'random-words';

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

    useEffect(() =>{

    }, [wordRows]);

    const changeActiveWord = () => {
        console.log(activeWord.current);
        activeWord.current.active = false;
        if(activeWordIndex.current < wordRows[activeRowIndex.current].length){
            activeWordIndex.current++;
            activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
        }else{
            activeRowIndex.current++;
            activeWordIndex.current = 0;
            activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
        }
        activeWord.current.active = true;
        console.log(activeWord.current);
    }


    const handleInput = (event : React.KeyboardEvent<HTMLInputElement>) : void =>{
        if(event.key === " "){     
            setCurrentInput("");
            changeActiveWord();
        }
    }

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) : void =>{
        setCurrentInput(event.target.value);
        if(event.target.value.endsWith(" ")){
            activeWord.current.correct = (activeWord.current.value == event.target.value);
        }else{
            activeWord.current.correct = (activeWord.current.value.startsWith(event.target.value));
        }
    }

    const initializeActiveWord = () =>{
        activeWord.current = wordRows[activeRowIndex.current][activeWordIndex.current];
    }

    useEffect(() =>{
        generateRows();
    }, [])


    return (
        <div>
            <form>
                <input type="text" value={currentInput} onKeyUp={event => handleInput(event)} onChange={event => handleChange(event)} onFocus={initializeActiveWord}/>
            </form>
        </div>
    )
}

export default TypingTest;