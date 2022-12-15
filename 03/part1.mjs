import { open } from 'node:fs/promises'

const file = await open('./input.txt')

let sum = 0

const getPriorityValue = (item) => {
  const itemCharCode = item.charCodeAt(0)
  if (itemCharCode > 96) {
    return itemCharCode - 96
  } else {
    return itemCharCode - 38
  }
}

for await (const line of file.readLines()) {
  const middle = Math.floor(line.length / 2)
  const rucksackOne = line.substring(0, middle).split('')
  const rucksackTwo = line.substring(middle).split('')
  const matches = []

  for (const idx in rucksackOne) {
    const item = rucksackOne[idx]
    if (rucksackTwo.includes(item) && !matches.includes(item)) {
      matches.push(item)
    }
  }

  for (const idx in matches) {
    sum += getPriorityValue(matches[idx])
  }
}

// Part One
console.log('What is the sum of the priorities of those item types?')
console.log(sum)