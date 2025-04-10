import { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage('Please enter an API token');
      return;
    }
    
    localStorage.setItem("notionToken", token);
    onLogin(token);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-300 p-4 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Login to Notion</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">API Token:</label>
            <input 
              type="password"
              value={token} 
              onChange={(e) => setToken(e.target.value)} 
              placeholder="Notion API token" 
              className="w-full p-1 border border-gray-300" 
            />
          </div>
          
          {errorMessage && (
            <div className="text-sm text-red-600">
              {errorMessage}
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
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}