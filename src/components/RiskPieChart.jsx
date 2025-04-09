import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];

export default function RiskPieChart({ data }) {
    const categoryCounts = data.reduce((acc, item) => {
        const category = item.properties?.['Risk Category']?.rich_text?.[0]?.text?.content || 'Unknown';
        acc[category] = (acc[category] || 0) + 1;
        
        return acc;
    }, {});

    const chartData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}
