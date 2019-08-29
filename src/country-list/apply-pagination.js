export default function applyPagination(resultsPerPage, currentPage, list) {
  if (!resultsPerPage) return list;

  let listItemsToShow = list.slice(
    resultsPerPage * (currentPage - 1),
    resultsPerPage * (currentPage - 1) + resultsPerPage
  );
  return listItemsToShow;
}
