import { useEffect, useState } from 'react';

export default function Splash() {
  const [showSlowNotice, setShowSlowNotice] = useState(false);

  useEffect(() => {
    // 5초 넘게 안 끝나면 "서버 깨우는 중" 안내 표시 (Render 슬립 대비)
    const timer = setTimeout(() => setShowSlowNotice(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '24px',
      }}
    >
      <div style={{ position: 'relative', width: '64px', height: '64px' }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid #1e293b',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#22c55e',
            animation: 'splash-spin 0.9s linear infinite',
          }}
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: 600 }}>
          서버에 연결하는 중...
        </div>
        {showSlowNotice && (
          <div style={{ color: '#8B92A5', fontSize: '13px', marginTop: '8px' }}>
            첫 접속 시 서버가 깨어나는 데 최대 1분 정도 걸릴 수 있어요.
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes splash-spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}