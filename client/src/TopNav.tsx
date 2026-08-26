type Tab = 'canvas' | 'stats';

interface TopNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TAB_STYLE_BASE: React.CSSProperties = {
  padding: '10px 20px',
  fontSize: '14px',
  fontWeight: 600,
  border: 'none',
  borderBottom: '2px solid transparent',
  background: 'transparent',
  color: '#94a3b8',
  cursor: 'pointer',
};

export default function TopNav({ activeTab, onTabChange }: TopNavProps) {
  return (
    <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #1e293b', padding: '0 16px' }}>
      <button
        style={{
          ...TAB_STYLE_BASE,
          color: activeTab === 'canvas' ? '#f8fafc' : '#94a3b8',
          borderBottomColor: activeTab === 'canvas' ? '#22c55e' : 'transparent',
        }}
        onClick={() => onTabChange('canvas')}
      >
        실시간 관제
      </button>
      <button
        style={{
          ...TAB_STYLE_BASE,
          color: activeTab === 'stats' ? '#f8fafc' : '#94a3b8',
          borderBottomColor: activeTab === 'stats' ? '#22c55e' : 'transparent',
        }}
        onClick={() => onTabChange('stats')}
      >
        통계 대시보드
      </button>
    </nav>
  );
}