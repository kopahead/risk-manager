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
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Add New Risk</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Risk Name:</label>
            <input 
              value={riskName} 
              onChange={(e) => setRiskName(e.target.value)} 
              placeholder="Risk name" 
              className="w-full p-1 border border-gray-300" 
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => { 
                setSelectedCategory(e.target.value); 
                setSelectedSubcategory(''); 
                setSelectedRiskType(''); 
              }} 
              className="w-full p-1 border border-gray-300"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {getEmojiForCategory(cat)} {cat}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Subcategory:</label>
            <select 
              value={selectedSubcategory} 
              onChange={(e) => { 
                setSelectedSubcategory(e.target.value); 
                setSelectedRiskType(''); 
              }} 
              disabled={!selectedCategory} 
              className="w-full p-1 border border-gray-300"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Risk Type:</label>
            <select 
              value={selectedRiskType} 
              onChange={(e) => setSelectedRiskType(e.target.value)} 
              disabled={!selectedSubcategory} 
              className="w-full p-1 border border-gray-300"
            >
              <option value="">Select Risk Type</option>
              {riskTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <label className="flex items-center space-x-2 text-sm">
            <input 
              type="checkbox" 
              checked={showPayload} 
              onChange={(e) => setShowPayload(e.target.checked)} 
            />
            <span>Show JSON payload</span>
          </label>
          
          {responseMessage && (
            <div className={`p-2 text-sm ${responseMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {responseMessage}
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
            <button 
              type="button" 
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-3 py-1 text-sm bg-gray-800 text-white" 
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : showPayload ? 'Generate' : 'Submit'}
            </button>
          </div>
          
          {showPayload && (
            <pre className="mt-2 p-2 border border-gray-300 text-xs overflow-auto max-h-60 bg-gray-50">
              {JSON.stringify(jsonPayload, null, 2)}
            </pre>
          )}
        </form>
      </div>
    </div>
  );
}