import { useState } from 'react';

export default function RiskManagementApp() {
  // Define risk categories and their subcategories
  const RISK_OPTIONS = {
    "Operational": {
      "Technical Architecture": [
        "Code Reliability and Quality",
        "System Scalability",
        "Performance and Optimisation",
        "Technical Debt Management",
        "Architecture Flexibility/Adaptability"
      ],
      "Operational Infrastructure": [
        "System Monitoring and Alerting",
        "Logging and Observability",
        "Disaster Recovery & Backup Management",
        "Infrastructure Resilience"
      ],
      "Development Processes": [
        "CI/CD Pipeline Reliability",
        "Testing Coverage and Strategy",
        "Code Maintainability",
        "Documentation Quality",
        "Version Control Practices"
      ],
      "Integration Points": [
        "API Reliability",
        "Third-party Dependencies",
        "Service Integrations"
      ],
      "Data Management": [
        "Data Integrity and Quality",
        "Database Performance",
        "Data Migration Risks",
        "Storage and Retention",
        "Data Recovery"
      ],
      "User Experience": [
        "Cross-platform Compatibility",
        "Performance Perception",
        "Error Handling and User Feedback",
        "Feature Discoverability"
      ],
      "Team Organisational Risks": [
        "Team Knowledge Sharing",
        "Team Skill Development",
        "Team Delivery Process",
        "Vendor Interface Management",
        "Internal Team Communication"
      ],
      "Release Management": [
        "Deployment Strategies",
        "Rollback Capabilities",
        "Feature Flagging",
        "Release Scheduling",
        "User Communication"
      ]
    },
    "Security": {
      "Access Control": [
        "Authentication and Authorization",
        "Network Security",
        "Physical Security"
      ],
      "Data Security": [
        "Data Protection and Privacy",
        "Cloud Security Configuration",
        "Endpoint Security"
      ],
      "Security Operations": [
        "Vulnerability Management",
        "Security Testing",
        "Incident Detection and Response",
        "Malware Protection"
      ],
      "Security Governance": [
        "Third-party Security Assessments",
        "Security Awareness and Training"
      ]
    },
    "Regulatory": {
      "Data Compliance": [
        "Data Privacy Regulations",
        "International Data Transfer Regulations",
        "Records Retention Requirements"
      ],
      "Legal Requirements": [
        "Compliance Requirements",
        "Industry-Specific Regulations",
        "Contractual Obligations",
        "Licensing Compliance"
      ],
      "Documentation & Reporting": [
        "Audit Trails and Evidence",
        "Reporting Requirements"
      ],
      "Special Legal Considerations": [
        "Accessibility Compliance",
        "Intellectual Property Protection",
        "Export Control Compliance"
      ]
    }
  };

  // State variables
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedRiskType, setSelectedRiskType] = useState('');
  const [riskName, setRiskName] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [jsonPayload, setJsonPayload] = useState({});

  // List of categories for rendering options
  const categories = Object.keys(RISK_OPTIONS);

  // Get subcategories based on selected category
  const subcategories = selectedCategory ? Object.keys(RISK_OPTIONS[selectedCategory]) : [];

  // Get risk types based on selected category and subcategory
  const riskTypes = (selectedCategory && selectedSubcategory) 
    ? RISK_OPTIONS[selectedCategory][selectedSubcategory] 
    : [];

  // Get emoji for risk category
  const getEmojiForCategory = (category) => {
    const emojis = {
      "Operational": "⚙️",
      "Security": "🔒",
      "Regulatory": "📜"
    };
    return emojis[category] || "📋";
  };

  // Create payload for Notion API
  const createPayload = () => {
    const payload = {
      "parent": { "database_id": "1cfbe24c0c90801d80a3e3f220e4f50c" },
      "icon": {
        "emoji": getEmojiForCategory(selectedCategory)
      },
      "properties": {
        "Name": {
          "title": [
            {
              "text": {
                "content": riskName
              }
            }
          ]
        },
        "Risk Category": {
          "rich_text": [
            {
              "text": {
                "content": selectedCategory
              }
            }
          ]
        },
        "Risk Sub-Category": {
          "rich_text": [
            {
              "text": {
                "content": selectedSubcategory
              }
            }
          ]
        },
        "Risk Type": {
          "rich_text": [
            {
              "text": {
                "content": selectedRiskType
              }
            }
          ]
        }
      }
    };
    return payload;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!riskName || !selectedCategory || !selectedSubcategory || !selectedRiskType) {
      setResponseMessage('Please fill in all fields');
      return;
    }

    const payload = createPayload();
    setJsonPayload(payload);
    
    if (showPayload) {
      return;
    }

    if (!apiToken) {
      setResponseMessage('API token is required to submit to Notion');
      return;
    }

    setIsLoading(true);
    setResponseMessage('');

    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage('Risk successfully added to Notion!');
        // Reset form
        setRiskName('');
        setSelectedCategory('');
        setSelectedSubcategory('');
        setSelectedRiskType('');
      } else {
        setResponseMessage(`Error: ${data.message || response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Risk Management Tool</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Risk Name */}
          <div>
            <label htmlFor="riskName" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Name
            </label>
            <input
              type="text"
              id="riskName"
              value={riskName}
              onChange={(e) => setRiskName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter risk name"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory('');
                setSelectedRiskType('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getEmojiForCategory(category)} {category}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection */}
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Sub-Category
            </label>
            <select
              id="subcategory"
              value={selectedSubcategory}
              onChange={(e) => {
                setSelectedSubcategory(e.target.value);
                setSelectedRiskType('');
              }}
              disabled={!selectedCategory}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a sub-category</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Type Selection */}
          <div>
            <label htmlFor="riskType" className="block text-sm font-medium text-gray-700 mb-1">
              Risk Type
            </label>
            <select
              id="riskType"
              value={selectedRiskType}
              onChange={(e) => setSelectedRiskType(e.target.value)}
              disabled={!selectedSubcategory}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a risk type</option>
              {riskTypes.map((riskType) => (
                <option key={riskType} value={riskType}>
                  {riskType}
                </option>
              ))}
            </select>
          </div>

          {/* API Token */}
          <div>
            <label htmlFor="apiToken" className="block text-sm font-medium text-gray-700 mb-1">
              Notion API Token
            </label>
            <input
              type="password"
              id="apiToken"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Notion API token"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your token is only used for API requests and is not stored.
            </p>
          </div>

          {/* Show Payload Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showPayload"
              checked={showPayload}
              onChange={(e) => setShowPayload(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showPayload" className="ml-2 block text-sm text-gray-700">
              Show JSON payload (dry run)
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'Submitting...' : showPayload ? 'Generate Payload' : 'Submit to Notion'}
            </button>
          </div>
        </form>

        {/* Response Message */}
        {responseMessage && (
          <div className={`mt-6 p-4 rounded-md ${responseMessage.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            <p>{responseMessage}</p>
          </div>
        )}

        {/* JSON Payload Display */}
        {showPayload && Object.keys(jsonPayload).length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">JSON Payload:</h2>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
              {JSON.stringify(jsonPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}