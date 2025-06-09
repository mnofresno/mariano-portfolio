const computeAge = require('../assets/js/age-compute');

test('computeAge returns correct age for fixed date', () => {
  const birth = new Date('2000-01-01');
  const current = new Date('2020-01-01');
  expect(computeAge(birth, current)).toBe(20);
});
