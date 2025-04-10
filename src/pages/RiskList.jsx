import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function RiskList() {
  const [riskData, setRiskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursors, setPrevCursors] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchRisks();
  }, [pageSize]);

  const fetchRisks = async (cursor = null, isPrevious = false) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("https://risk-manager-app.netlify.app/.netlify/functions/notion-fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: localStorage.getItem("notionToken"),
          start_cursor: cursor,
          page_size: pageSize,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch risks");
      
      setRiskData(data.results.results);
      
      // Handle pagination state
      if (isPrevious) {
        // Pop the last cursor from prevCursors when going back
        const newPrevCursors = [...prevCursors];
        newPrevCursors.pop();
        setPrevCursors(newPrevCursors);
      } else if (cursor && !isPrevious) {
        // Add current cursor to prevCursors when going forward
        setPrevCursors([...prevCursors, cursor]);
      }
      
      // Set the next cursor from response
      setNextCursor(data.results.next_cursor);
      setHasMore(!!data.results.has_more);
    } catch (err) {
      console.error("Failed to fetch risks:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      fetchRisks(nextCursor);
    }
  };

  const handlePreviousPage = () => {
    const prevCursor = prevCursors.length > 0 ? prevCursors[prevCursors.length - 1] : null;
    fetchRisks(prevCursor, true);
  };

  const handlePageSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    // Reset pagination state when changing page size
    setNextCursor(null);
    setPrevCursors([]);
  };

  if (isLoading && riskData.length === 0) return <div className="py-4">Loading risks...</div>;
  if (error) return <div className="py-4 text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold">Risk Registry</h1>
        <div className="flex items-center space-x-4">
          <label className="text-sm">
            Items per page:
            <select 
              value={pageSize} 
              onChange={handlePageSizeChange}
              className="ml-2 px-2 py-1 border border-gray-300 rounded"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>
      
      {isLoading && <div className="py-2 text-gray-500">Loading...</div>}
      
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
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          {riskData.length > 0 ? `Showing ${riskData.length} items` : "No items"}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={prevCursors.length === 0}
            className={`px-3 py-1 border rounded ${
              prevCursors.length === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={handleNextPage}
            disabled={!hasMore}
            className={`px-3 py-1 border rounded ${
              !hasMore 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-blue-600 hover:bg-blue-50'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}