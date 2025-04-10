import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function RiskDetail() {
  const { riskId } = useParams();
  const [risk, setRisk] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskDetail = async () => {
      try {
        const response = await fetch("/.netlify/functions/notion-get-risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: localStorage.getItem("notionToken"),
            riskId
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch risk details");
        
        setRisk(data);
      } catch (err) {
        console.error("Failed to fetch risk details:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (riskId) {
      fetchRiskDetail();
    }
  }, [riskId]);

  if (isLoading) return <div className="py-4">Loading risk details...</div>;
  if (error) return <div className="py-4 text-red-600">Error: {error}</div>;
  if (!risk) return <div className="py-4">Risk not found</div>;

  const getEmojiForCategory = (category) => {
    const emojis = {
      Operational: '⚙️',
      Security: '🔒',
      Regulatory: '📜'
    };
    return emojis[category] || '📋';
  };

  const category = risk.properties['Risk Category']?.rich_text?.[0]?.text?.content;
  const emoji = getEmojiForCategory(category);

  return (
    <div>
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; back
        </Link>
      </div>
      
      <h1 className="text-lg font-bold mb-2">
        {emoji} {risk.properties.Name?.title?.[0]?.text?.content || 'Unnamed Risk'}
      </h1>
      
      <table className="w-full border-collapse mt-4">
        <tbody>
          <tr>
            <td className="py-2 pr-4 border-b border-gray-200 font-medium text-gray-600 w-1/4">Category</td>
            <td className="py-2 border-b border-gray-200">{category || 'Not specified'}</td>
          </tr>
          <tr>
            <td className="py-2 pr-4 border-b border-gray-200 font-medium text-gray-600">Sub-Category</td>
            <td className="py-2 border-b border-gray-200">
              {risk.properties['Risk Sub-Category']?.rich_text?.[0]?.text?.content || 'Not specified'}
            </td>
          </tr>
          <tr>
            <td className="py-2 pr-4 border-b border-gray-200 font-medium text-gray-600">Risk Type</td>
            <td className="py-2 border-b border-gray-200">
              {risk.properties['Risk Type']?.rich_text?.[0]?.text?.content || 'Not specified'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}