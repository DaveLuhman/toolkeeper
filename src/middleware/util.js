function paginate(dataArray, targetPage, perPage) {
    const data = dataArray || [];
    const perPage = perPage || 10;
    const targetPage = targetPage || 1
    const pageCount = Math.ceil(data.length / perPage);  //number of pages
    const trimmedData = data.slice((perPage * targetPage) - perPage, (perPage * targetPage));
    return { trimmedData, targetPage, pageCount};
}