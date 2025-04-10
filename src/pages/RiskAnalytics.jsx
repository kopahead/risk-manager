import { useState, useEffect } from 'react';
import RiskPieChart from '../components/RiskPieChart';

export default function RiskAnalytics() {
  const [riskData, setRiskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const response = await fetch("/.netlify/functions/notion-fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("notionToken"),
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch risks");
        
        setRiskData(data.results.results);
      } catch (err) {
        console.error("Failed to fetch risks:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisks();
  }, []);

  if (isLoading) return <div className="py-4">Loading analytics...</div>;
  if (error) return <div className="py-4 text-red-600">Error: {error}</div>;

  // Create a simple text-based analytics view
  const categoryCounts = {};
  riskData.forEach(risk => {
    const category = risk.properties['Risk Category']?.rich_text?.[0]?.text?.content || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Risk Analytics</h1>
      
      {riskData.length > 0 ? (
        <div>
          <table className="w-full border-collapse mb-8">
            <thead>
              <tr>
                <th className="text-left py-2 border-b border-gray-300">Category</th>
                <th className="text-left py-2 border-b border-gray-300">Count</th>
                <th className="text-left py-2 border-b border-gray-300">Distribution</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryCounts).map(([category, count]) => (
                <tr key={category} className="hover:bg-gray-50">
                  <td className="py-2 border-b border-gray-200">{category}</td>
                  <td className="py-2 border-b border-gray-200">{count}</td>
                  <td className="py-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <div 
                        className="bg-gray-500 h-4" 
                        style={{ width: `${(count / riskData.length) * 100}%` }}
                      ></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {Math.round((count / riskData.length) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <RiskPieChart data={riskData} />
        </div>
      ) : (
        <p className="text-gray-500">No risk data available for analysis.</p>
      )}
    </div>
  );
}