/**
 * Increments the rightmost consecutive digits in a string by a given iteration.
 *
 * @param {string} str - The input string.
 * @param {number} iteration - The number to increment by.
 * @returns {string} - The modified string with the rightmost consecutive digits incremented.
 */
const incrementRightmostNumber = (str, iteration) => {
  const regex = /\d+(?!.*\d)/
  const match = str.match(regex)

  if (match) {
    const rightmostNumber = match[0]
    const incrementedNumber = parseInt(rightmostNumber, 10) + parseInt(iteration, 10)
    const startPosition = match.index
    const endPosition = startPosition + rightmostNumber.length
    return str.slice(0, startPosition) + incrementedNumber + str.slice(endPosition)
  }

  return str
}
 
/**
 * Checks if a string ends with a number.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} Returns true if the string ends with a number, otherwise returns false.
 */
const endsWithNumber = (str) => {
    const regex = /\d+$/;
    return regex.test(str);
  };