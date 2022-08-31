import './game.scss';
import Grid from '../components/grid.js';
import Header from '../components/header.js';
import KeyBoard from '../components/keyboard.js'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import getLanguageConfigs from '../components/language-configs';

export default function Game(props) {
  const [searchParams] = useSearchParams();
  const width = parseInt(searchParams.get("width"))
  const height = parseInt(searchParams.get("height"))
  const language = searchParams.get("language")
  const [mysteryWord, setMysteryWord] = useState(null)
  const [currentRow, setCurrentRow] = useState(0)
  const [currentWord, setCurrentWord] = useState("")
  const [guessedWords, setGuessedWords] = useState([])
  const [pressedKey, setPressedKey] = useState("")
  const [flashMessage, setFlashMessage] = useState(null)
  const [validWords, setValidWords] = useState([])
  const [keyboard, setKeyboard] = useState([])

  const onKeyPress = (key) => {
    setPressedKey(key);
  }

  useEffect(() => {
    const config = getLanguageConfigs()[language]
    fetch(config.wordsUrl, {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        const validWords = Object.keys(data)
          .filter(word => word.length == width)
          .map(word => word.toUpperCase())
        setValidWords(validWords)
        setMysteryWord(validWords[Math.floor(Math.random()*validWords.length)])
        setKeyboard(config.keyboard)
      })
  }, [])

  useEffect(() => {
    if (pressedKey === "") {
      return;
    }
    // If the pressed key is a letter
    // - If current word is equal to the width, do nothing.
    // - If current word is less than the width, add character to current word. 
    if (pressedKey !== 'ENTER' && pressedKey !== 'BACKSPACE') {
      if (currentWord === width) {
        // no-op
      } else {
        setCurrentWord(currentWord + pressedKey)
      }
    }
    
    // If the pressed key is the backspace button
    // - If current word is empty, do nothing.
    // - If current word has at least one character, remove last character from current word.
    if (pressedKey === "BACKSPACE") {
      setCurrentWord(currentWord.slice(0, -1))
    }

    // If the pressed key is the enter button
    // - If current word is not wide enough, show "not enough letters"
    // - If current word is equal to the width:
    // --- if current word is in the dictionary,
            // increment the current ROW by 1,
            // add the word to the guessedWords
            // set currentWord to ""
    // ---- if current word is not in the dictionary, show "not in word list"
    if (pressedKey === "ENTER") {
      if (currentWord.length < width) {
        flash("Not enough letters!")
        console.log("Not enough letters!")
      } else {
        console.log(currentWord)
        if (validWords.includes(currentWord)) {
          setCurrentRow(currentRow + 1)
          setGuessedWords(guessedWords.concat(currentWord))
          setCurrentWord("")
        } else {
          flash("Not in word list")
          console.log("not in word list")
        }
      }
    }
    setPressedKey("")
  }, [pressedKey])

  const flash = (message) => {
    setFlashMessage(message);
    setTimeout(() => {
      setFlashMessage(null)
    }, 1000) // Show it for 1000 seconds.
  }

  const getContent = () => {
    const objectToReturn = {}
    for (let currentWordIndex = 0; currentWordIndex < currentWord.length; currentWordIndex++) {
      objectToReturn[`${currentRow},${currentWordIndex}`] = {
        color: 'black',
        text: currentWord[currentWordIndex]
      }
    }
    guessedWords.forEach((guessedWord, rowNumber) => {
      for (let guessedWordIndex = 0; guessedWordIndex < guessedWord.length; guessedWordIndex++) {
        const gridRowNumber = rowNumber
        const gridColumnNumber = guessedWordIndex
        const character = guessedWord[guessedWordIndex]
        let color; 
        if (!mysteryWord.includes(character)) {
          color = "grey"
        } else if (mysteryWord[guessedWordIndex] === character) {
          color = "green"
        } else {
          color = "yellow"
        }
        objectToReturn[`${gridRowNumber},${gridColumnNumber}`] = {
          color: color,
          text: character
        }
      }
    })

    return objectToReturn;
  }

  const userWon = guessedWords.includes(mysteryWord)
  const userLost = !guessedWords.includes(mysteryWord) && guessedWords.length === height
  return (
    <div className="app-container">
      <Header />
      {userWon && <div className="winner"> You win! </div>}
      {userLost && <div className="loser"> You lost! The Word Was {mysteryWord} </div>}
      {flashMessage != null && <div className="flash">{flashMessage}</div>}
      <Grid
        width={width}
        height={height}
        content={getContent()}
        />
      <KeyBoard
        keyboardConfiguration={keyboard}
        onKeyPress={(key) => onKeyPress(key)}
      />
    </div>
  );
}
