const { calculatetip, fahrenheitToCelsius, celsiusToFahrenheit } = require('../src/math')

test('calculate total with tip', () => {
    const total = calculatetip(10, 0.3)
    expect(total).toBe(13)
})

test('Should calculate total with default tip', () => {
    const total = calculatetip(10)
    expect(total).toBe(12.5)
})

test('c to f', () => {
    const val = celsiusToFahrenheit(0)
    expect(val).toBe(32)
})

test('F to C', () => {
    const val = fahrenheitToCelsius(32)
    expect(val).toBe(0)
})

