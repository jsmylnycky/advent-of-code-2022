import { open } from 'node:fs/promises'

const file = await open('./input.txt')

const ROUND_LIMIT = 10000
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


// https://en.wikipedia.org/wiki/Greatest_common_divisor#Euclid%27s_algorithm
const gcd = (x, y) => !y ? x : gcd(y, x % y)

// https://en.wikipedia.org/wiki/Least_common_multiple#Using_the_greatest_common_divisor
const lcm = (x, y) => Math.abs(x) / gcd(x, y) * Math.abs(y)

// lcm(a,b,c) = lcm(a,lcm(b,c))
const lcmFromArray = (arr) => arr.length === 2 ? lcm(...arr) : lcm(arr.shift(), lcmFromArray(arr))

const LCM = lcmFromArray(monkies.map(monkey => monkey.test))

const processWorryLevel = (worryLevel, operation) => {
  const ops = operation.split(' ')
  let newLevel = 0

  if (ops[0] === 'old') ops[0] = worryLevel
  if (ops[2] === 'old') ops[2] = worryLevel

  switch (ops[1]) {
    case '+':
      newLevel = parseInt(ops[0], 10) + parseInt(ops[2], 10)
      break
    case '-':
      newLevel = parseInt(ops[0], 10) - parseInt(ops[2], 10)
      break
    case '*':
      newLevel = parseInt(ops[0], 10) * parseInt(ops[2], 10)
      break
    case '/':
      newLevel = parseInt(ops[0], 10) / parseInt(ops[2], 10)
      break
  }

  if (newLevel > LCM) {
    newLevel = newLevel % LCM
  }

  return Math.floor(newLevel)
}

const processItems = (monkey) => {
  if (monkey.items.length === 0) {
    return
  }

  let item = monkey.items.shift()
  monkey.inspections++

  item = processWorryLevel(item, monkey.operation)

  let throwTo = -1
  if (item % monkey.test === 0) {
    throwTo = monkey.result[0]
  } else {
    throwTo = monkey.result[1]
  }
    
  monkies[throwTo].items.push(item)

  if (monkey.items.length > 0) {
    processItems(monkey)
  }
}

for await (const round of [...Array(ROUND_LIMIT).keys()]) {
  for await (const monkey of monkies) {
    processItems(monkey)
  }

  if ([1, 20, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000].includes(round + 1)) {
    console.log()
    console.log(`== After round ${round + 1} ==`)
    for await (const [monkeyIdx, monkey] of monkies.entries()) {
      console.log(`Monkey ${monkeyIdx} inspected items ${monkey.inspections} times.`)
    }
    console.log()
  }
}

const inspections = []
for await (const monkey of monkies) {
  inspections.push(monkey.inspections)
}

inspections.sort((x, y) => y - x)

console.log()
console.log(`Total level of monkey business is: ${inspections[0] * inspections[1]}`)

