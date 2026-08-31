import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ComposedChart, Line,
} from 'recharts';
import type { Device } from './types/device';

interface StatsDashboardProps {
  devices: Device[];
}

const COLORS = {
  green: '#22c55e',
  orange: '#f97316',
  red: '#ef4444',
  bg: '#0a0f1a',
};

const STATUS_LABELS: Record<string, string> = {
  normal: '정상',
  warning: '경고',
  error: '이상',
};

function batteryColor(battery: number): string {
  if (battery >= 50) return COLORS.green;
  if (battery >= 20) return COLORS.orange;
  return COLORS.red;
}

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(155deg, #1a2233 0%, #0d1420 100%)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
};

export default function StatsDashboard({ devices }: StatsDashboardProps) {
  const total = devices.length;
  const normalCount = devices.filter((d) => d.status === 'normal').length;
  const warningCount = devices.filter((d) => d.status === 'warning').length;
  const errorCount = devices.filter((d) => (d.status as string) === 'error').length;

  const statusChartData = [
    { name: STATUS_LABELS.normal, value: normalCount, key: 'normal', color: COLORS.green },
    { name: STATUS_LABELS.warning, value: warningCount, key: 'warning', color: COLORS.orange },
    { name: STATUS_LABELS.error, value: errorCount, key: 'error', color: COLORS.red },
  ].filter((d) => d.value > 0);

  const batteryChartData = [...devices]
    .sort((a, b) => a.battery - b.battery)
    .map((d) => ({ id: d.id, battery: d.battery }));

  const combinedChartData = devices.map((d) => ({
    id: d.id,
    temperature: d.temperature,
    battery: d.battery,
    status: d.status,
  }));

  return (
    <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', background: COLORS.bg }}>

      {/* 요약 카드 (상단 info 영역 - 그대로 유지, 스타일만 그라데이션) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <div style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(79,142,247,0.18), #0d1420)' }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '6px' }}>전체 장비</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#fff' }}>{total}</div>
        </div>
        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${COLORS.green}2e, #0d1420)` }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '6px' }}>정상</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.green }}>{normalCount}</div>
        </div>
        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${COLORS.orange}2e, #0d1420)` }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '6px' }}>경고</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.orange }}>{warningCount}</div>
        </div>
        <div style={{ ...cardStyle, background: `linear-gradient(135deg, ${COLORS.red}2e, #0d1420)` }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '6px' }}>이상</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: COLORS.red }}>{errorCount}</div>
        </div>
      </div>

      {/* 2번째 줄: 파이(1/3) + 배터리 바 차트(2/3) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

        <div style={{ ...cardStyle, height: '340px' }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '16px' }}>상태 비율</div>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <defs>
                {statusChartData.map((entry) => (
                  <linearGradient key={entry.key} id={`grad-${entry.key}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color} stopOpacity={0.5} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={statusChartData}
                dataKey="value"
                nameKey="name"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false} 
              >
                {statusChartData.map((entry) => (
                  <Cell key={entry.key} fill={`url(#grad-${entry.key})`} />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                wrapperStyle={{ fontSize: '12px', color: '#8B92A5' }}
              />
              <Tooltip
                contentStyle={{ background: '#0d1420', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ ...cardStyle, height: '340px' }}>
          <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '16px' }}>장비별 배터리 잔량</div>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={batteryChartData}>
              <defs>
                <linearGradient id="battery-green" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.green} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="battery-orange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.orange} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0.25} />
                </linearGradient>
                <linearGradient id="battery-red" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.red} stopOpacity={1} />
                  <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.25} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#1e293b" vertical={false} />
              <XAxis dataKey="id" stroke="#8B92A5" fontSize={11} angle={-45} height={60} textAnchor="end" />
              <YAxis stroke="#8B92A5" fontSize={11} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: '#0d1420', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="battery" radius={[6, 6, 0, 0]}>
                {batteryChartData.map((entry) => {
                  const color = batteryColor(entry.battery);
                  const gradId =
                    color === COLORS.green ? 'battery-green' : color === COLORS.orange ? 'battery-orange' : 'battery-red';
                  return <Cell key={entry.id} fill={`url(#${gradId})`} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3번째 줄: 온도(막대) + 배터리(선) 복합 차트, 전체 폭 */}
      <div style={{ ...cardStyle, height: '360px' }}>
        <div style={{ color: '#8B92A5', fontSize: '13px', marginBottom: '16px' }}>장비별 온도 · 배터리 추이</div>
        <ResponsiveContainer width="100%" height="88%">
          <ComposedChart data={combinedChartData}>
            <defs>
              <linearGradient id="temp-green" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.green} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.green} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="temp-orange" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.orange} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.orange} stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="temp-red" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.red} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.red} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" vertical={false} />
            <XAxis dataKey="id" stroke="#8B92A5" fontSize={11} />
            <YAxis yAxisId="temp" stroke="#8B92A5" fontSize={11} domain={[0, 100]} />
            <YAxis yAxisId="battery" orientation="right" stroke="#8B92A5" fontSize={11} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#0d1420', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#8B92A5' }} />
            <Bar yAxisId="temp" dataKey="temperature" name="온도(°C)" radius={[6, 6, 0, 0]} barSize={28} isAnimationActive={false} >
              {combinedChartData.map((entry) => {
                const gradId =
                  entry.status === 'normal' ? 'temp-green' : entry.status === 'warning' ? 'temp-orange' : 'temp-red';
                return <Cell key={entry.id} fill={`url(#${gradId})`} />;
              })}
            </Bar>
            <Line
              yAxisId="battery"
              type="monotone"
              dataKey="battery"
              name="배터리(%)"
              stroke="#4F8EF7"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#4F8EF7' }}
              isAnimationActive={false} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}