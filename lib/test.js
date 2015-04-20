const runTests = false

export default {
  describe: (name, suite) => {
    if (runTests) {
      suite(it(name))
    }
  }
}

function it (name) {
  return (testName, suite) => {
    suite(expect(`${name} ${testName}`))
  }
}

function expect (name) {
  return (value) => {
    return {
      toEq: (eq) => {
        if (value == eq) {
          console.log(name, 'PASSED')
        } else {
          console.error(`${name}, FAILED, expected ${eq} but received ${value}`)
        }
      }
    }
  }
}
