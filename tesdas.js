function personFactory(name) {
  let count = 0

  return {
    opa: () => count++,
    count,
    name: name,
    type: 'person'
  }
}

const tulio = personFactory('Tulio')

const joao = personFactory('João')

console.log(tulio.opa())

console.log(tulio.opa())

console.log(tulio.count);

let a = 0
console.log(a += 1);

console.log(a);