const parseContactType = (type) => {
  const isString = typeof type === 'string';
  if (!isString) return;

  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
  return undefined;
};

const parseBoolean = (value) => {
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return undefined;
};

export default function parseContactFilterParams(query) {
  const { isFavourite, type } = query;

  const parsedIsFavourite = parseBoolean(isFavourite);
  const parsedType = parseContactType(type);

  return {
    isFavourite: parsedIsFavourite,
    contactType: parsedType,
  };
}
