import { useState, useEffect } from 'react';
import RiskPieChart from './components/RiskPieChart';
import SidebarNavigation from './components/SidebarNavigation';
import RiskFormModal from './components/RiskFormModal';
import LoginModal from './components/LoginModal';

export default function RiskManagementApp() {
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

  const categories = Object.keys(RISK_OPTIONS);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedRiskType, setSelectedRiskType] = useState('');
  const [riskName, setRiskName] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [jsonPayload, setJsonPayload] = useState({});
  const [riskData, setRiskData] = useState([]);
  const [activePage, setActivePage] = useState('list');
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("notionToken");
    if (storedToken) {
      setApiToken(storedToken);
    }
  }, []);

  const subcategories = selectedCategory ? Object.keys(RISK_OPTIONS[selectedCategory]) : [];
  const riskTypes = (selectedCategory && selectedSubcategory) ? RISK_OPTIONS[selectedCategory][selectedSubcategory] : [];

  const getEmojiForCategory = (category) => {
    const emojis = {
      Operational: '⚙️',
      Security: '🔒',
      Regulatory: '📜'
    };
    return emojis[category] || '📋';
  };

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
        setShowRiskModal(false);
      } else {
        setResponseMessage(`Error: ${data.message || response.statusText}`);
      }
    } catch (error) {
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
        setRiskData(data.results.results);
      } catch (err) {
        console.error("Failed to fetch risks:", err);
      }
    };

    fetchRisks();
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarNavigation
        activePage={activePage}
        setActivePage={setActivePage}
        onAddRisk={() => setShowRiskModal(true)}
        onLogin={() => setShowLoginModal(true)}
        onLogout={() => {
          localStorage.removeItem("notionToken");
          setApiToken("");
        }}
        isAuthenticated={!!apiToken}
      />

      <main className="flex-1 p-6">
        {activePage === 'list' && (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Risk Analytics</h1>
        
                <div className="grid gap-4">
                {riskData.map((risk) => (
                    <div key={risk.id} className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold">{risk.properties.Name?.title?.[0]?.text?.content || 'Unnamed Risk'}</h2>
                    <p className="text-gray-600 text-sm">{risk.properties['Risk Category']?.rich_text?.[0]?.text?.content}</p>
        
                    <button
                        onClick={() => window.location.href = `/risk/${risk.id}`}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        View Details
                    </button>
                    </div>
                ))}
                </div>
            </div>
        )}
        

        {activePage === 'analytics' && riskData.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Risk Category Breakdown</h2>
            <RiskPieChart data={riskData} />
          </div>
        )}
      </main>

      <RiskFormModal isOpen={showRiskModal} onClose={() => setShowRiskModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={riskName} onChange={(e) => setRiskName(e.target.value)} placeholder="Risk name" className="w-full p-2 border rounded" />
          <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSelectedSubcategory(''); setSelectedRiskType(''); }} className="w-full p-2 border rounded">
            <option value="">Select Category</option>
            {categories.map((cat) => (<option key={cat} value={cat}>{getEmojiForCategory(cat)} {cat}</option>))}
          </select>
          <select value={selectedSubcategory} onChange={(e) => { setSelectedSubcategory(e.target.value); setSelectedRiskType(''); }} disabled={!selectedCategory} className="w-full p-2 border rounded">
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (<option key={sub} value={sub}>{sub}</option>))}
          </select>
          <select value={selectedRiskType} onChange={(e) => setSelectedRiskType(e.target.value)} disabled={!selectedSubcategory} className="w-full p-2 border rounded">
            <option value="">Select Risk Type</option>
            {riskTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
          </select>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={showPayload} onChange={(e) => setShowPayload(e.target.checked)} />
            <span>Show JSON payload (dry run)</span>
          </label>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isLoading}>
            {isLoading ? 'Submitting...' : showPayload ? 'Generate Payload' : 'Submit'}
          </button>
          {showPayload && (
            <pre className="bg-gray-100 p-2 mt-2 rounded text-sm overflow-auto">
              {JSON.stringify(jsonPayload, null, 2)}
            </pre>
          )}
        </form>
      </RiskFormModal>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={(token) => setApiToken(token)} />
    </div>
  );
}
