'use server';

import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

export interface AuthActionState {
  error?: string;
  success?: boolean;
}

export async function signup(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: '모든 필드를 입력해 주세요.' };
  }

  if (password.length < 6) {
    return { error: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: '이미 사용 중인 이메일입니다.' };
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    return { success: true };
  } catch (error) {
    console.error('Signup error:', error);
    return { error: '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}

export async function login(prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해 주세요.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: '가입되지 않은 이메일이거나 비밀번호가 틀렸습니다.' };
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return { error: '가입되지 않은 이메일이거나 비밀번호가 틀렸습니다.' };
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'strict',
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { error: '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session_token');
}
