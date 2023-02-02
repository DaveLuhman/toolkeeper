/**
 *
 * @param {array} dataArray
 * @param {number} targetPage
 * @param {number} perPage
 * @returns {object} trimmedData, targetPage, pageCount
 */
export function paginate(data, targetPage, perPage) {
  perPage = perPage || 10;
  targetPage = targetPage || 1;
  const pageCount = Math.ceil(data.length / perPage); //number of pages
  const trimmedData = data.slice(
    perPage * targetPage - perPage,
    perPage * targetPage + 1
  );
  return { trimmedData, targetPage, pageCount };
}
