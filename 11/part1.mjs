import { open } from 'node:fs/promises'

const file = await open('./input.txt')

const ROUND_LIMIT = 1000
const monkies = [/*
  {
    items: [],
    operation: '',
    test: 0,
    result: [],
    inspections: 0
  }
*/]

let monkey = {}

for await (const line of file.readLines()) {
  if (line.startsWith('Monkey')) {
    monkey = {
      items: [],
      operation: '',
      test: 0,
      result: [],
      inspections: 0
    }
  } else if (line.trim().startsWith('Starting items')) {
    monkey.items = line.split(':')[1].replaceAll(' ', '').split(',').map((x) => parseInt(x, 10))
  } else if (line.trim().startsWith('Operation')) {
    monkey.operation = line.split('=')[1].trim()
  } else if (line.trim().startsWith('Test')) {
    monkey.test = parseInt(line.split('divisible by')[1].trim(), 10)
  } else if (line.trim().startsWith('If true')) {
    monkey.result[0] = parseInt(line.split('throw to monkey')[1].trim(), 10)
  } else if (line.trim().startsWith('If false')) {
    monkey.result[1] = parseInt(line.split('throw to monkey')[1].trim(), 10)
    monkies.push(monkey)
  }
}

const processWorryLevel = (worryLevel, operation) => {
  const ops = operation.split(' ')
  let newLevel = 0

  if (ops[0] === 'old') ops[0] = worryLevel
  if (ops[2] === 'old') ops[2] = worryLevel

  switch (ops[1]) {
    case '+':
      newLevel = parseInt(ops[0], 10) + parseInt(ops[2], 10)
      console.log(`    Worry level increases by ${ops[2]} to ${newLevel}.`)
      break
    case '-':
      newLevel = parseInt(ops[0], 10) - parseInt(ops[2], 10)
      break
    case '*':
      newLevel = parseInt(ops[0], 10) * parseInt(ops[2], 10)
      console.log(`    Worry level is multiplied by ${ops[2]} to ${newLevel}.`)
      break
    case '/':
      newLevel = parseInt(ops[0], 10) / parseInt(ops[2], 10)
      break
  }

  return newLevel
}

const processItems = (monkey) => {
  if (monkey.items.length === 0) {
    return
  }

  let item = monkey.items.shift()
  monkey.inspections++
  console.log(`  Monkey inspects an item with a worry level of ${item}.`)

  item = Math.floor(processWorryLevel(item, monkey.operation) / 3)
  console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}`)

  let throwTo = -1
  if (item % monkey.test === 0) {
    console.log(`    Current worry level is divisible by ${monkey.test}.`)
    throwTo = monkey.result[0]  
  } else {
    console.log(`    Current worry level is not divisible by ${monkey.test}.`)
    throwTo = monkey.result[1]
  }

  console.log(`    Item with worry level ${item} is thrown to monkey ${throwTo}.`)
  monkies[throwTo].items.push(item)

  if (monkey.items.length > 0) {
    processItems(monkey)
  }
}

for await (const round of [...Array(ROUND_LIMIT).keys()]) {
  for await (const [monkeyIdx, monkey] of monkies.entries()) {
    console.log(`Monkey ${monkeyIdx}:`)

    processItems(monkey)
  }

  console.log()
  console.log(`After round ${round + 1}, the monkeys are holding items with these worry levels:`)
  for await (const [monkeyIdx, monkey] of monkies.entries()) {
    console.log(`Monkey ${monkeyIdx}: ${monkey.items}`)
  }

  console.log()
}

const inspections = []
for await (const [monkeyIdx, monkey] of monkies.entries()) {
  console.log(`Monkey ${monkeyIdx} inspected items ${monkey.inspections} times.`)
  inspections.push(monkey.inspections)
}

inspections.sort((x, y) => y - x)

console.log()
console.log(`Total level of monkey business is: ${inspections[0] * inspections[1]}`)

