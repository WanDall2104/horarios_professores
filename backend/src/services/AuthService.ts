import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'segredo123';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async cadastrar(email: string, senha: string) {
    const existe = await this.prisma.usuario.findUnique({ where: { email } });
    if (existe) throw new AppError('Email já cadastrado', 400);

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await this.prisma.usuario.create({
      data: { email, senha: senhaHash },
    });

    return { id: usuario.id, email: usuario.email };
  }

  async login(email: string, senha: string) {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError('Email ou senha inválidos', 401);

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new AppError('Email ou senha inválidos', 401);

    const token = jwt.sign({ id: usuario.id, email }, JWT_SECRET, { expiresIn: '8h' });
    return { token };
  }
}