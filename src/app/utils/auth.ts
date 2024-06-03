import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};
import jwt from 'jsonwebtoken';

const JWT_SECRET = '885101685766993g66ea54fu46j3ldqpjpt4ut1nn'; // Use an environment variable in production

export const generateToken = (userId: string, role: 'STUDENT' | 'FACULTY') => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
