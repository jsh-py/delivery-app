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
      const timer = setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  if (state?.success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card glass-panel" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div className="success-icon" style={{ fontSize: '64px', animation: 'bounce 1s infinite' }}>🎉</div>
          <h1 className="auth-title">회원가입 완료!</h1>
          <p className="auth-subtitle" style={{ marginBottom: 0, lineHeight: '1.6' }}>
            성공적으로 회원가입이 완료되었습니다.<br />
            잠시 후 메인 화면으로 이동합니다...
          </p>
          <div className="loading-bar-container" style={{ width: '100%', height: '4px', background: 'var(--border-glass)', borderRadius: '2px', overflow: 'hidden' }}>
            <div className="loading-bar" style={{ width: '100%', height: '100%', background: 'var(--primary)', animation: 'load 2s linear forwards' }} />
          </div>
          <style>{`
            @keyframes load {
              from { width: 0%; }
              to { width: 100%; }
            }
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </div>
    );
  }

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
