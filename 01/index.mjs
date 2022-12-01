import { open } from 'node:fs/promises'

const file = await open('./input.txt')

const calories = []
let elfCarrying = 0

for await (const line of file.readLines()) {
  if (!line) {
    calories.push(elfCarrying)
    elfCarrying = 0
  } else {
    elfCarrying += Number(line)
  }
}

// Part One
console.log('Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?')
console.log(Math.max(...calories))

console.log()

// Part Two
console.log('Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?')
console.log([...calories].sort((a, b) => a - b).slice(-3).reduce((a, b) => a + b, 0))
