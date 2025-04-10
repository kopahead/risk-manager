import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RiskList() {
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

  if (isLoading) return <div className="text-center p-6">Loading risks...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Risk Analytics</h1>
      
      <div className="grid gap-4">
        {riskData.length > 0 ? (
          riskData.map((risk) => (
            <div key={risk.id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">
                {risk.properties.Name?.title?.[0]?.text?.content || 'Unnamed Risk'}
              </h2>
              <p className="text-gray-600 text-sm">
                {risk.properties['Risk Category']?.rich_text?.[0]?.text?.content}
              </p>
              
              <Link
                to={`/risk/${risk.id}`}
                className="mt-2 text-sm text-blue-600 hover:underline inline-block"
              >
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No risks found. Add your first risk using the button in the sidebar.</p>
        )}
      </div>
    </div>
  );
}