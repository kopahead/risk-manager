import { useState } from 'react';
import { RISK_OPTIONS, getEmojiForCategory } from '../utils/riskOptions';

export default function RiskFormModal({ isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedRiskType, setSelectedRiskType] = useState('');
  const [riskName, setRiskName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [showPayload, setShowPayload] = useState(false);
  const [jsonPayload, setJsonPayload] = useState({});

  const categories = Object.keys(RISK_OPTIONS);
  const subcategories = selectedCategory ? Object.keys(RISK_OPTIONS[selectedCategory]) : [];
  const riskTypes = (selectedCategory && selectedSubcategory) ? RISK_OPTIONS[selectedCategory][selectedSubcategory] : [];

  const createPayload = () => ({
    parent: { database_id: '1cfbe24c0c90801d80a3e3f220e4f50c' },
    icon: { emoji: getEmojiForCategory(selectedCategory) },
    properties: {
      Name: { title: [{ text: { content: riskName } }] },
      'Risk Category': { rich_text: [{ text: { content: selectedCategory } }] },
      'Risk Sub-Category': { rich_text: [{ text: { content: selectedSubcategory } }] },
      'Risk Type': { rich_text: [{ text: { content: selectedRiskType } }] }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!riskName || !selectedCategory || !selectedSubcategory || !selectedRiskType) {
      setResponseMessage('Please fill in all fields');
      return;
    }
    
    const payload = createPayload();
    setJsonPayload(payload);
    
    if (showPayload) return;
    
    const apiToken = localStorage.getItem("notionToken");
    if (!apiToken) {
      setResponseMessage('API token is required to submit to Notion');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('/.netlify/functions/notion-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, token: apiToken })
      });
      
      const data = await response.json();
      if (response.ok) {
        setResponseMessage('Risk successfully added to Notion!');
        setRiskName('');
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedRiskType('');
        onClose();
      } else {
        setResponseMessage(`Error: ${data.message || response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add New Risk</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            value={riskName} 
            onChange={(e) => setRiskName(e.target.value)} 
            placeholder="Risk name" 
            className="w-full p-2 border rounded" 
          />
          
          <select 
            value={selectedCategory} 
            onChange={(e) => { 
              setSelectedCategory(e.target.value); 
              setSelectedSubcategory(''); 
              setSelectedRiskType(''); 
            }} 
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {getEmojiForCategory(cat)} {cat}
              </option>
            ))}
          </select>
          
          <select 
            value={selectedSubcategory} 
            onChange={(e) => { 
              setSelectedSubcategory(e.target.value); 
              setSelectedRiskType(''); 
            }} 
            disabled={!selectedCategory} 
            className="w-full p-2 border rounded"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
          
          <select 
            value={selectedRiskType} 
            onChange={(e) => setSelectedRiskType(e.target.value)} 
            disabled={!selectedSubcategory} 
            className="w-full p-2 border rounded"
          >
            <option value="">Select Risk Type</option>
            {riskTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          
          <label className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              checked={showPayload} 
              onChange={(e) => setShowPayload(e.target.checked)} 
            />
            <span>Show JSON payload (dry run)</span>
          </label>
          
          {responseMessage && (
            <div className={`p-2 rounded ${responseMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {responseMessage}
            </div>
          )}
          
          <div className="flex justify-end space-x-2 mt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : showPayload ? 'Generate Payload' : 'Submit'}
            </button>
          </div>
          
          {showPayload && (
            <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto max-h-60">
              {JSON.stringify(jsonPayload, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </div>
  );
}