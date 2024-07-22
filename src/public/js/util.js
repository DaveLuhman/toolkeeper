const incrementRightmostNumber = (str, iteration) => {
  const regex = /\d+(?!.*\d)/
  const match = str.match(regex)

  if (match) {
    const rightmostNumber = match[0]
    const incrementedNumber = parseInt(rightmostNumber, 10) + parseInt(iteration)
    const startPosition = match.index
    const endPosition = startPosition + rightmostNumber.length
    return str.slice(0, startPosition) + incrementedNumber + str.slice(endPosition)
  }

  return str
}

const endsWithNumber = (str) => {
    const regex = /\d+$/;
    return regex.test(str);
  };