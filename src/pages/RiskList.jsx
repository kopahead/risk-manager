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

  if (isLoading) return <div className="py-4">Loading risks...</div>;
  if (error) return <div className="py-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <h1 className="text-lg font-bold mb-4">Risk Registry</h1>
      
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left py-2 border-b border-gray-300">Risk Name</th>
            <th className="text-left py-2 border-b border-gray-300">Category</th>
            <th className="text-left py-2 border-b border-gray-300">Type</th>
          </tr>
        </thead>
        <tbody>
          {riskData.length > 0 ? (
            riskData.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50">
                <td className="py-2 border-b border-gray-200">
                  <Link
                    to={`/risk/${risk.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {risk.properties.Name?.title?.[0]?.text?.content || 'Unnamed Risk'}
                  </Link>
                </td>
                <td className="py-2 border-b border-gray-200 text-gray-600">
                  {risk.properties['Risk Category']?.rich_text?.[0]?.text?.content}
                </td>
                <td className="py-2 border-b border-gray-200 text-gray-600">
                  {risk.properties['Risk Type']?.rich_text?.[0]?.text?.content}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-gray-500">
                No risks found. Add your first risk using the "Add Risk" button.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}