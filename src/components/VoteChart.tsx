import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface VoteChartProps {
  forVotes: string;
  againstVotes: string;
  abstainVotes: string;
}

const COLORS = {
  for: '#4ade80',
  against: '#f87171',
  abstain: '#9ca3af',
};

export function VoteChart({ forVotes, againstVotes, abstainVotes }: VoteChartProps) {
  const data = [
    {
      name: 'For',
      value: parseInt(forVotes) / 1e18,
      color: COLORS.for,
    },
    {
      name: 'Against',
      value: parseInt(againstVotes) / 1e18,
      color: COLORS.against,
    },
    {
      name: 'Abstain',
      value: parseInt(abstainVotes) / 1e18,
      color: COLORS.abstain,
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-md bg-black/80 border border-white/20 rounded-lg p-3">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-gray-300">{payload[0].value.toFixed(1)} votes</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '14px',
              color: '#ffffff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}