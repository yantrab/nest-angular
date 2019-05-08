import { genSalt, hash, compare } from 'bcrypt';
export const cryptPassword = async password => {
  const salt = await genSalt(10);
  return hash(password, salt);
};

export const comparePassword = (plainPass, hashword) => {
  return compare(plainPass, hashword);
};
