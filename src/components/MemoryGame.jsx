import { useEffect, useState } from 'react'

const MemoryGame = () => {
  const [boardSize, setBoardSize] = useState(2)
  const [cards, setCards] = useState([])

  const [flipped, setFlipped] = useState([])
  const [solved, setSolved] = useState([])
  const [disabled, setDisabled] = useState(false)

  const [won, setWon] = useState(false)

  const handleBoardSizeChange = (e) => {
    const size = parseInt(e.target.value)
    if (size >= 2 && size <= 6) {
      setBoardSize(size)
    }
  }

  const initializeCards = () => {
    // create an array of cards
    const totalCards = boardSize * boardSize
    const pairCount = Math.floor(totalCards / 2)

    // create an array of numbers which contains 1, 2, ..., pairCount
    const cardNumbers = Array.from(
      { length: pairCount },
      (_, index) => index + 1,
    )

    // add numbers to the cards
    // [{ id: 1, number: 1 }, { id: 2, number: 1 }, { id: 3, number: 2 }, { id: 4, number: 2 }]
    const cards = cardNumbers.reduce((acc, number) => {
      const card1 = { id: number * 2 - 1, number }
      const card2 = { id: number * 2, number }
      return acc.concat(card1, card2)
    }, [])

    // shuffle the cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5)

    // set the cards and reset the game
    setCards(shuffledCards)
    setFlipped([])
    setSolved([])
    setWon(false)
  }

  const handleCardClick = (cardId) => {
    if (disabled || won) return

    if (flipped.length === 0) {
      setFlipped([cardId])
      return
    }
    if (flipped.length === 1) {
      setDisabled(true)
      if (cardId !== flipped[0]) {
        setFlipped([...flipped, cardId])
        // check match logic
        checkMatch(cardId)
      } else {
        setDisabled(false)
        setFlipped([])
      }
    }
  }

  const isCardFlipped = (id) => flipped.includes(id) || solved.includes(id)

  const isCardSolved = (id) => solved.includes(id)

  const checkMatch = (secondCardId) => {
    const firstCardId = flipped[0]

    if (
      cards.find((card) => card.id === firstCardId).number ===
      cards.find((card) => card.id === secondCardId).number
    ) {
      setSolved([...solved, firstCardId, secondCardId])
      setFlipped([])
      setDisabled(false)
    } else {
      setTimeout(() => {
        setFlipped([])
        setDisabled(false)
      }, 1000)
    }
  }

  useEffect(() => {
    initializeCards()
  }, [boardSize])

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true)
    }
  }, [solved, cards])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* input */}
      <h2 className="text-2xl font-bold mb-6">Memory Game</h2>
      <div className="mb-4">
        <label htmlFor="Board Size" className="mr-3">
          Board Size: (Max 6)
        </label>
        <select
          type="number"
          name="Board Size"
          id="boardSize"
          value={boardSize}
          onChange={handleBoardSizeChange}
          className="border-2 border-gray-300 rounded px-3 py-1 outline-none"
        >
          {[2, 4, 6].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* game board */}
      <div
        className="grid gap-2 my-3 cursor-pointer"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          width: `${boardSize * 5}rem`,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className={`aspect-square font-bold rounded-lg m-1 flex items-center justify-center cursor-pointer text-xl transition-all duration-300 shadow-md ${
              isCardFlipped(card.id)
                ? isCardSolved(card.id)
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-500'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {isCardFlipped(card.id) ? card.number : '?'}
          </div>
        ))}
      </div>

      {/* result */}
      {won && (
        <div className="mt-5 text-3xl font-bold text-green-600 animate-bounce">
          🎉 You Won! 🥳
        </div>
      )}

      {/* reset button / play again */}
      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        onClick={initializeCards}
      >
        {won ? 'Play Again' : 'Reset'}
      </button>
    </div>
  )
}

export default MemoryGame
