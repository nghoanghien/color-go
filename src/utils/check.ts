export const isValidEmail = (email: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidName = (name: any) => {
  const words = name.trim().split(/\s+/);
  return words.length >= 2 && words.every((word: any) => /^[A-Za-zÀ-ỹ\s]+$/.test(word));
 };

 export const isValidPhone = (phone: any) => {
  return /^[0-9]{10,}$/.test(phone.replace(/\s/g, ''));
 };