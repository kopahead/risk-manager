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

  if (isLoading) return <div className="text-center p-6">Loading risk details...</div>;
  if (error) return <div className="text-red-500 p-6">Error: {error}</div>;
  if (!risk) return <div className="text-center p-6">Risk not found</div>;

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
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Risk List
      </Link>
      
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">{emoji}</span>
        <h1 className="text-2xl font-bold">
          {risk.properties.Name?.title?.[0]?.text?.content || 'Unnamed Risk'}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Risk Category</h3>
          <p>{category || 'Not specified'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Risk Sub-Category</h3>
          <p>{risk.properties['Risk Sub-Category']?.rich_text?.[0]?.text?.content || 'Not specified'}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Risk Type</h3>
          <p>{risk.properties['Risk Type']?.rich_text?.[0]?.text?.content || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}