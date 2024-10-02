const parseInteger = (value, defaultValue) => {
  console.log(value);
  if(typeof value !== "string") return defaultValue;

  const parsedValue = parseInt(value);
  if(Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

export default function parsePaginationParams ({perPage, page}) {
  const parsedPerPage = parseInteger(perPage, 10);
  const parsedPage = parseInteger(page, 1);

  return {
      perPage: parsedPerPage,
      page: parsedPage,
  };
};

