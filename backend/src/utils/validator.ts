// Vérifie si une chaîne est un email valide
export const isEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Vérifie si une chaîne est un numéro de téléphone valide (8 à 15 chiffres)
export const isPhoneNumber = (phone: string): boolean => {
  const regex = /^[0-9]{8,15}$/;
  return regex.test(phone);
};

// Vérifie si une chaîne n'est pas vide
export const isNotEmpty = (value: string | undefined | null): boolean => {
  return value != null && value.trim() !== '';
};
