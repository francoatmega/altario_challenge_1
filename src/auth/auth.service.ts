import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private readonly users = [
    {
      username: process.env.AUTH_USERNAME || 'admin',
      // Em produção, use uma senha hash armazenada de forma segura
      password: process.env.AUTH_PASSWORD || 'admin123',
    },
  ];

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      return false;
    }

    // Em produção, use bcrypt.compare
    return user.password === password;
  }
} 