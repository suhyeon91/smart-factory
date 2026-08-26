import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import type { Device } from './types/device';

interface StatsDashboardProps {
  devices: Device[];
}

const STATUS_COLORS: Record<string, string> = {
  normal: '#22c55e',
  warning: '#f97316',
  error: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  normal: '정상',
  warning: '경고',
  error: '이상',
};

const cardStyle: React.CSSProperties = {
  background: '#1e293b',
  borderRadius: '10px',
  padding: '20px',
  flex: 1,
  minWidth: '140px',
};

export default function StatsDashboard({ devices }: StatsDashboardProps) {
  const total = devices.length;
  const normalCount = devices.filter((d) => d.status === 'normal').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const errorCount = devices.filter((d) => (d.status as string) === 'error').length;

  const typeCounts = devices.reduce<Record<string, number>>((acc, d) => {
    acc[d.type] = (acc[d.type] ?? 0) + 1;
    return acc;
  }, {});
  const typeChartData = Object.entries(typeCounts).map(([type, count]) => ({ type, count }));

  const statusChartData = [
    { name: STATUS_LABELS.normal, value: normalCount, key: 'normal' },
    { name: STATUS_LABELS.warning, value: warningCount, key: 'warning' },
    { name: STATUS_LABELS.error, value: errorCount, key: 'error' },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
      {/* 요약 카드 */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>전체 장비</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f8fafc' }}>{total}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>정상</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: STATUS_COLORS.normal }}>{normalCount}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>경고</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: STATUS_COLORS.warning }}>{warningCount}</div>
        </div>
        <div style={cardStyle}>
          <div style={{ color: '#94a3b8', fontSize: '13px' }}>이상</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: STATUS_COLORS.error }}>{errorCount}</div>
        </div>
      </div>

      {/* 차트 영역 */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ ...cardStyle, minWidth: '320px', height: '280px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>장비 타입별 개수</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={typeChartData}>
              <XAxis dataKey="type" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="count" fill="#4F8EF7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...cardStyle, minWidth: '320px', height: '280px' }}>
          <div style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '12px' }}>상태 비율</div>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie data={statusChartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                {statusChartData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Pie>
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}