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

  if (isLoading) return <div className="text-center p-6">Loading analytics...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Risk Category Breakdown</h2>
      {riskData.length > 0 ? (
        <RiskPieChart data={riskData} />
      ) : (
        <p className="text-gray-500">No risk data available for analysis.</p>
      )}
    </div>
  );
}