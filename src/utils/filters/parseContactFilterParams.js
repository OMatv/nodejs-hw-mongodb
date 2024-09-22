import parseInteger from './parseNumber.js';

export default function parseContactFilterParams({
  minAge,
  maxAge,
  name,
  email,
}) {
  const parsedMinAge = parseInteger(minAge);
  const parsedMaxAge = parseInteger(maxAge);

  return {
    minAge: parsedMinAge,
    maxAge: parsedMaxAge,
    name: name ? name.trim() : undefined,
    email: email ? email.trim() : undefined,
  };
}
