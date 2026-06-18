'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signup, AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {
  error: '',
  success: false,
};

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signup, initialState);

  React.useEffect(() => {
    if (state?.success) {
      alert('회원가입이 완료되었습니다!');
      router.push('/');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <h1 className="auth-title">회원가입</h1>
        <p className="auth-subtitle">간편하게 가입하고 맛있는 음식을 주문해 보세요</p>

        {state?.error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">이름</label>
            <input
              className="form-input"
              id="name"
              name="name"
              type="text"
              placeholder="홍길동"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">이메일 주소</label>
            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">비밀번호</label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              placeholder="•••••••• (6자 이상)"
              required
            />
          </div>

          <button
            className="btn btn-primary auth-btn"
            type="submit"
            disabled={isPending}
          >
            {isPending ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-footer">
          이미 계정이 있으신가요?{' '}
          <Link className="auth-link" href="/login">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
