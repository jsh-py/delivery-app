'use client';

import React, { useActionState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, AuthActionState } from '@/app/actions/auth';

const initialState: AuthActionState = {
  error: '',
  success: false,
};

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(login, initialState);

  React.useEffect(() => {
    if (state?.success) {
      router.push('/');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <h1 className="auth-title">로그인</h1>
        <p className="auth-subtitle">배달앱 서비스에 오신 것을 환영합니다</p>

        {state?.error && (
          <div className="error-message">
            <span>⚠️</span>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction}>
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
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className="btn btn-primary auth-btn"
            type="submit"
            disabled={isPending}
          >
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="auth-footer">
          아직 계정이 없으신가요?{' '}
          <Link className="auth-link" href="/signup">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
