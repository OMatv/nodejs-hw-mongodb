// Функція для перевірки і валідації рядка
const parseString = (value) => {
  if (typeof value !== "string" || value.trim() === "") return undefined; // Явне повернення undefined
  return value.trim();
};

// Функція для перевірки і валідації телефонного номера
const parseNumber = (number) => {
  if (typeof number !== 'string') return undefined;

  const parsedNumber = parseInt(number, 10);
  if (Number.isNaN(parsedNumber)) {
    return undefined;
  }

  return parsedNumber;
};

// Функція для перевірки і валідації типу контакту
const parseContactType = (value) => {
  if (typeof value !== 'string') return undefined; // Перевірка типу
  const contactTypes = ['work', 'home', 'personal'];
  if (!contactTypes.includes(value)) return undefined;
  return value;
};

// Головна функція для парсингу параметрів запиту
export default function parseContactFilterParams({ query = {} }) {
  const { name, email, phoneNumber, contactType, isFavourite } = query;

  // Парсимо та конвертуємо параметри
  const parsedName = parseString(name);
  const parsedPhoneNumber = parseNumber(phoneNumber);
  const parsedEmail = parseString(email);
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined;

  // Повертаємо об'єкт з відфільтрованими параметрами
  return {
    name: parsedName,
    phoneNumber: parsedPhoneNumber,
    email: parsedEmail,
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
}
