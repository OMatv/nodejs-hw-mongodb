
// // Функція для перевірки і валідації рядка
// const parseString = (value) => {
//   if (typeof value !== "string" || value.trim() === "") return;
//   return value.trim();
// };

// // Функція для перевірки і валідації телефонного номера
// const parseNumber = (number) => {
//   const isString = typeof number === 'string';
//   if (!isString) return;

//   const parsedNumber = parseInt(number);
//    if (Number.isNaN(parsedNumber)) {
//     return;
//   }

//   return parsedNumber;
// };

//  const parseContactType = (value)  => {
//   if (typeof value === 'string') return;
//   const contactTypes = ['work', 'home', 'personal'];
//   if (!contactTypes.includes(value));
//   return value;
//  }


// export default function parseContactFilterParams({ query}) {
//   const {name, email, phoneNumber, contactType, isFavourite} = query;

//   const parsedName = parseString(name);
//   const parsedPhoneNumber = parseNumber(phoneNumber);
//   const parsedEmail = parseString(email);
//   const parsedContactType = parseContactType(contactType);
//   const parsedIsFavourite = isFavourite === 'true' ? true : isFavourite === 'false';

//   return {
//     name: parsedName,
//     phoneNumber: parsedPhoneNumber,
//     email: parsedEmail,
//     contactType: parsedContactType,
//     isFavourite: parsedIsFavourite
//   };
// }

// Функція для перевірки і валідації рядка
const parseString = (value) => {
  if (typeof value !== "string" || value.trim() === "") return;
  return value.trim();
};

// Функція для перевірки і валідації телефонного номера
const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number, 10); // Додали підставу 10
  if (Number.isNaN(parsedNumber)) {
    return;
  }

  return parsedNumber;
};

// Функція для перевірки і валідації типу контакту
const parseContactType = (value) => {
  if (typeof value !== 'string') return; // Змінено на '!=='
  const contactTypes = ['work', 'home', 'personal'];
  if (!contactTypes.includes(value)) return; // Прибираємо зайву крапку з коми
  return value; // Повертаємо value
};

// Головна функція для парсингу параметрів запиту
export default function parseContactFilterParams({ query = {} }) { // Додаємо значення за замовчуванням
  const { name, email, phoneNumber, contactType, isFavourite } = query;

  const parsedName = parseString(name);
  const parsedPhoneNumber = parseNumber(phoneNumber);
  const parsedEmail = parseString(email);
  const parsedContactType = parseContactType(contactType);
  const parsedIsFavourite = isFavourite === 'true' ? true : isFavourite === 'false' ? false : undefined; // Додали значення за замовчуванням

  return {
    name: parsedName,
    phoneNumber: parsedPhoneNumber,
    email: parsedEmail,
    contactType: parsedContactType,
    isFavourite: parsedIsFavourite,
  };
}
