import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository';

const JWT_SECRET = process.env.JWT_SECRET || 'redgreenmotors-super-secret-key-2026';

export const authService = {
  async register(data: { name?: string; email?: string; password?: string }) {
    if (!data.name || !data.email || !data.password) {
      const err: any = new Error('Missing required fields: name, email, and password');
      err.status = 400;
      throw err;
    }

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      const err: any = new Error('User with this email already exists');
      err.status = 409;
      throw err;
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: 'USER',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async login(data: { email?: string; password?: string }) {
    if (!data.email || !data.password) {
      const err: any = new Error('Missing email and password');
      err.status = 400;
      throw err;
    }

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      const err: any = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      const err: any = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },
};
