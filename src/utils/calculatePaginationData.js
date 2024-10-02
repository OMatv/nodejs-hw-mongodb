export default function calculatePaginationData({ count, perPage, page }) {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
}
