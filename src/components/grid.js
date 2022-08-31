import "./grid.scss";

export default function Grid(props) {
  const tiles = [...Array(props.height).keys()].map((rowNumber, _) =>
    <div className="row" key={`${rowNumber}`}> 
      {[...Array(props.width).keys()].map((columnNumber, _) => {
        const content = props.content[`${rowNumber},${columnNumber}`]
        if (content) {
          return (
            <div
              className={`tile background-${content["color"]}`}
              key={`${rowNumber}-${columnNumber}`}>
              {content["text"]}
            </div>
          )
        } else {
          return (
            <div
              className="tile"
              key={`${rowNumber}-${columnNumber}`}>
            </div>
          )
        }
      })}
    </div>
  )
  return (
    <div className="grid-container">
      <div className="tiles-container">
        {tiles}
      </div>
    </div>
  )
}