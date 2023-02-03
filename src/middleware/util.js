/**
 *
 * @param {array} dataArray
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
function paginate(dataArray, targetPage, perPage) {
  if (!Array.isArray(dataArray)) {
    throw new Error("Please provide an array");
  }

  if (typeof targetPage !== "number") {
    throw new Error("Please provide a target page number");
  }

  perPage = perPage || 10;
  targetPage = targetPage || 1;
  const pageCount = Math.ceil(dataArray.length / perPage);
  const trimmedData = dataArray.slice(
    perPage * targetPage - perPage,
    perPage * targetPage
  );

  return { trimmedData, targetPage, pageCount };
}

/**
 * @param {any} data
 * @returns {array}
 * This function will mutate the data to an array
 */
function mutateToArray(data) {
  // If data is not an array, convert it to an array
  if (!Array.isArray(data)) {
    data = [data];
  }
  return data;
}