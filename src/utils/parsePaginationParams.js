const parseInteger = (value) => {
  if (typeof value !== 'string') return;

  const parsedNumber = parseInt(value, 10);
  if (Number.isNaN(parsedNumber) || parsedNumber <= 0) return;

  return parsedNumber;
};

export default function parsePaginationParams({ page, perPage }) {
  // Перевірка та парсинг параметрів
  const parsedPage = parseInteger(page) || 1;
  const parsedPerPage = parseInteger(perPage) || 10;

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
}
