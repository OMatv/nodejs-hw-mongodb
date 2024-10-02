
// Функція для перевірки і валідації рядка
const parseString = (value) => {
  if (typeof value !== "string" || value.trim() === "") return;
  return value.trim();
};

// Функція для перевірки і валідації телефонного номера
const parsePhoneNumber = (value) => {
  if (typeof value !== "string") return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

export default function parseContactFilterParams({ name, phoneNumber }) {
  const parsedName = parseString(name);
  const parsedPhoneNumber = parsePhoneNumber(phoneNumber);

  return {
    name: parsedName,
    phoneNumber: parsedPhoneNumber,
  };
}
