import './keyboard.scss'

export default function Keyboard(props) {
  const characterRows = props.keyboardConfiguration
  return (
    <div className="keyboard-container">
      {characterRows.map((row, i) => {
        return (
          <div className="row-container" key={i}>
            ({row.map((character, j) => {
              return (
                <div
                  className="keyword-button"
                  key={j}
                  onClick={() => props.onKeyPress(character)}
                >
                  {character}
                </div>
              )
            })})
          </div>
        )
      })}

    </div>
  )
}