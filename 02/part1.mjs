import { open } from 'node:fs/promises'

const file = await open('./input.txt')

const ROCK     = 1
const PAPER    = 2
const SCISSORS = 3

const LOST = 0
const DRAW = 3
const WON = 6

// X = ROCK
// Y = PAPER
// Z = SCISSORS

const inputs = {
  'A': { // Opponent Rock
    'X': ROCK + DRAW,
    'Y': PAPER + WON,
    'Z': SCISSORS + LOST
  },
  'B': { // Opponent Paper
    'X': ROCK + LOST,
    'Y': PAPER + DRAW,
    'Z': SCISSORS + WON
  },
  'C': { // Opponent Scissors
    'X': ROCK + WON,
    'Y': PAPER + LOST,
    'Z': SCISSORS + DRAW
  }
}

let totalScore = 0

for await (const line of file.readLines()) {
  const roundInputs = line.split(' ')

  totalScore += inputs[roundInputs[0]][roundInputs[1]]
}

// Part One
console.log('What would your total score be if everything goes exactly according to your strategy guide?')
console.log(totalScore)

console.log()