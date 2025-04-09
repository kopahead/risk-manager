import { useState, useEffect } from "react";
import { Bell, User, LogOut, Users, Settings, Plus, ChevronDown, MessageSquare, Search, Link, X, ExternalLink } from "lucide-react";

const riskData = [
  {
    id: 1,
    product: "Insurance Service",
    risk: "Insufficient Grafana Alerts",
    riskType: "Operational",
    customerAcquisition: 5,
    customerRetention: 4,
    otherCosts: 3,
    likelihood: 75,
    effort: 3,
    jiraStories: [
      { id: "RISK-101", title: "Set up additional Grafana alert rules", status: "in-progress", assignee: "Alex Johnson" },
      { id: "RISK-102", title: "Document alerting strategy", status: "todo", assignee: "Jamie Smith" },
      { id: "RISK-105", title: "Create runbook for alert responses", status: "done", assignee: "Sam Taylor" }
    ]
  },
  {
    id: 2,
    product: "Siyavika",
    risk: "Inconsistent Logging",
    riskType: "Operational",
    customerAcquisition: 3,
    customerRetention: 2,
    otherCosts: 4,
    likelihood: 50,
    effort: 2,
    jiraStories: [
      { id: "RISK-201", title: "Standardize logging format across services", status: "in-progress", assignee: "Jamie Smith" }
    ]
  },
  {
    id: 3,
    product: "Mobile App",
    risk: "Authentication Vulnerabilities",
    riskType: "Security",
    customerAcquisition: 4,
    customerRetention: 5,
    otherCosts: 5,
    likelihood: 50,
    effort: 4,
    jiraStories: []
  },
];

const impactMapping = {
  1: { value: 1, label: "Minor", emoji: "🍃" },
  2: { value: 2, label: "Low", emoji: "🌱" },
  3: { value: 3, label: "Moderate", emoji: "🔥" },
  4: { value: 4, label: "Significant", emoji: "🚒" },
  5: { value: 5, label: "Critical", emoji: "💥" },
};

const likelihoodMapping = {
  0: { value: 0, label: "Not at all likely", emoji: "❄️" },
  25: { value: 25, label: "Low likelihood", emoji: "🌊" },
  50: { value: 50, label: "Medium likelihood", emoji: "⚡" },
  75: { value: 75, label: "High likelihood", emoji: "🌪️" },
  100: { value: 100, label: "Certain", emoji: "☄️" },
};

const effortMapping = {
  1: { value: 1, label: "Minimal", color: "bg-green-100 text-green-800" },
  2: { value: 2, label: "Low", color: "bg-blue-100 text-blue-800" },
  3: { value: 3, label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
  4: { value: 4, label: "High", color: "bg-orange-100 text-orange-800" },
  5: { value: 5, label: "Extreme", color: "bg-red-100 text-red-800" },
};

const impactOptions = Object.keys(impactMapping).map(Number);
const likelihoodOptions = [0, 25, 50, 75, 100];
const effortOptions = Object.keys(effortMapping).map(Number);

const storyStatusMapping = {
  "todo": { color: "bg-gray-100", label: "To Do" },
  "in-progress": { color: "bg-blue-100", label: "In Progress" },
  "review": { color: "bg-purple-100", label: "Review" },
  "done": { color: "bg-green-100", label: "Done" },
  "blocked": { color: "bg-red-100", label: "Blocked" }
};

const onlineTeamMembers = [
  { id: 1, name: "Jamie Smith", avatar: "JS", status: "online", role: "Risk Manager" },
  { id: 2, name: "Alex Johnson", avatar: "AJ", status: "online", role: "Dev Lead" },
  { id: 3, name: "Sam Taylor", avatar: "ST", status: "away", role: "Product Owner" },
];

export default function RiskCommandCenter() {
  const [data, setData] = useState(riskData);
  const [selectedCell, setSelectedCell] = useState(null);
  const [votes, setVotes] = useState([]);
  const [showVotes, setShowVotes] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [teamInviteEmail, setTeamInviteEmail] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [storyForm, setStoryForm] = useState({ title: "", assignee: "", status: "todo" });
  const [searchQuery, setSearchQuery] = useState("");
  const [showJiraPanel, setShowJiraPanel] = useState(false);

  const openDialog = (row, field) => {
    setSelectedCell({ row, field });
    setVotes([]);
    setShowVotes(false);
  };

  const submitVote = () => {
    if (selectedCell && votes.length > 0) {
      const average = calculateAverage(votes);
      const updatedData = data.map((item) =>
        item.id === selectedCell.row.id ? { ...item, [selectedCell.field]: average } : item
      );
      setData(updatedData);
      setSelectedCell(null);
    }
  };

  const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return Math.round(sum / numbers.length);
  };

  const calculatePriority = (totalImpact, likelihood, effort) => {
    // Expected risk = totalImpact * (likelihood/100)
    // Priority = Expected risk / effort
    const expectedRisk = totalImpact * (likelihood / 100);
    return (expectedRisk / effort).toFixed(2);
  };

  const getRiskSummary = () => {
    const totalRisks = data.length;
    
    const highPriorityRisks = data.filter(row => {
      const totalImpact = row.customerAcquisition + row.customerRetention + row.otherCosts;
      const priority = calculatePriority(totalImpact, row.likelihood, row.effort);
      return parseFloat(priority) > 2;
    }).length;
    
    const totalExpectedImpact = data.reduce((sum, row) => {
      const totalImpact = row.customerAcquisition + row.customerRetention + row.otherCosts;
      return sum + (totalImpact * (row.likelihood / 100));
    }, 0).toFixed(1);
    
    const totalJiraStories = data.reduce((sum, row) => sum + row.jiraStories.length, 0);
    
    return { totalRisks, highPriorityRisks, totalExpectedImpact, totalJiraStories };
  };

  const getValueDisplay = (value, isImpact, isEffort) => {
    if (isEffort) {
      const { label, color } = effortMapping[value] || effortMapping[1];
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {value} - {label}
        </span>
      );
    }
    
    const mapping = isImpact ? impactMapping : likelihoodMapping;
    
    if (isImpact) {
      const flooredValue = Math.floor(value);
      const { emoji, label } = mapping[flooredValue] || mapping[1];
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>
      );
    } else {
      const keys = Object.keys(mapping).map(Number).sort((a, b) => a - b);
      let closestKey = 0;
      
      for (let key of keys) {
        if (key <= value) closestKey = key;
        else break;
      }
      
      const { emoji, label } = mapping[closestKey];
      return (
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>
      );
    }
  };

  const getOptions = (field) => {
    if (field === "likelihood") {
      return likelihoodOptions.map((option) => ({
        value: option,
        ...likelihoodMapping[option]
      }));
    } else if (field === "effort") {
      return effortOptions.map((option) => ({
        value: option,
        label: effortMapping[option].label,
        color: effortMapping[option].color
      }));
    } else {
      return impactOptions.map((option) => ({
        value: option,
        ...impactMapping[option]
      }));
    }
  };

  const inviteTeamMember = () => {
    if (teamInviteEmail) {
      // Socket logic would go here
      alert(`Invite sent to ${teamInviteEmail}`);
      setTeamInviteEmail("");
    }
  };

  const openJiraStories = (risk) => {
    setSelectedRisk(risk);
    setShowJiraPanel(true);
  };

  const addJiraStory = () => {
    if (selectedRisk && storyForm.title) {
      const newStory = {
        id: `RISK-${Math.floor(Math.random() * 900) + 100}`,
        title: storyForm.title,
        status: storyForm.status,
        assignee: storyForm.assignee || "Unassigned"
      };
      
      const updatedData = data.map(risk => 
        risk.id === selectedRisk.id 
          ? { ...risk, jiraStories: [...risk.jiraStories, newStory] }
          : risk
      );
      
      setData(updatedData);
      setStoryForm({ title: "", assignee: "", status: "todo" });
    }
  };

  const removeJiraStory = (riskId, storyId) => {
    const updatedData = data.map(risk => 
      risk.id === riskId 
        ? { ...risk, jiraStories: risk.jiraStories.filter(story => story.id !== storyId) }
        : risk
    );
    
    setData(updatedData);
  };

  const updateStoryStatus = (riskId, storyId, newStatus) => {
    const updatedData = data.map(risk => 
      risk.id === riskId 
        ? { 
            ...risk, 
            jiraStories: risk.jiraStories.map(story => 
              story.id === storyId 
                ? { ...story, status: newStatus }
                : story
            )
          }
        : risk
    );
    
    setData(updatedData);
  };

  const calculateStoryCompletion = (stories) => {
    if (stories.length === 0) return 0;
    const doneStories = stories.filter(story => story.status === "done").length;
    return Math.round((doneStories / stories.length) * 100);
  };

  const getStoryStatusSummary = (stories) => {
    const counts = {
      todo: 0,
      "in-progress": 0,
      review: 0,
      done: 0,
      blocked: 0
    };
    
    stories.forEach(story => {
      if (counts[story.status] !== undefined) {
        counts[story.status]++;
      }
    });
    
    return counts;
  };

  const { totalRisks, highPriorityRisks, totalExpectedImpact, totalJiraStories } = getRiskSummary();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="flex justify-between items-center px-6 py-3">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-purple-600 text-white rounded flex items-center justify-center mr-3 text-xl font-bold">
              R
            </div>
            <h1 className="text-xl font-bold text-gray-900">Risk Command Center</h1>
          </div>
          
          <div className="flex items-center space-x-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="bg-gray-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            
            <button className="relative">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <Users className="h-5 w-5 mr-1" />
              <span 
                onClick={() => setShowTeamPanel(!showTeamPanel)}
                className="text-sm font-medium"
              >
                Team
              </span>
            </button>
            
            <button>
              <Settings className="h-5 w-5 text-gray-500" />
            </button>
            
            <div className="flex items-center border-l border-gray-300 pl-5">
              <div className="h-8 w-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-2 text-sm font-bold">
                JS
              </div>
              <div className="text-sm font-medium">Jamie Smith</div>
              <button className="ml-3 text-gray-500 hover:text-gray-700">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800">Risk Boards</h2>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mb-6">
            <div className="bg-purple-50 text-purple-600 rounded p-3 mb-2 font-medium flex items-center">
              <span className="h-3 w-3 bg-purple-600 rounded-full mr-2"></span>
              Main Risk Board
            </div>
            <div className="text-gray-600 rounded p-3 hover:bg-gray-100 cursor-pointer">
              <span className="h-3 w-3 bg-blue-400 rounded-full mr-2 inline-block"></span>
              Product Risks
            </div>
            <div className="text-gray-600 rounded p-3 hover:bg-gray-100 cursor-pointer">
              <span className="h-3 w-3 bg-green-400 rounded-full mr-2 inline-block"></span>
              Security Risks
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-500 mb-2 text-xs uppercase">Summary</h3>
            <div className="space-y-3">
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-500">Total Risks</div>
                <div className="text-lg font-bold">{totalRisks}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-500">High Priority Risks</div>
                <div className="text-lg font-bold text-red-600">{highPriorityRisks}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-500">Total Expected Impact</div>
                <div className="text-lg font-bold">{totalExpectedImpact}</div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-3">
                <div className="text-xs text-gray-500">Jira Stories</div>
                <div className="text-lg font-bold text-blue-600">{totalJiraStories}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-500 mb-2 text-xs uppercase">Jira Integration</h3>
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 bg-blue-500 rounded flex-shrink-0 mr-2"></div>
                <div className="text-sm font-medium">Jira Connected</div>
              </div>
              <div className="text-xs text-gray-600">
                Stories are being synchronized with your Jira instance.
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Risk Dashboard</h2>
              <p className="text-gray-500">Collaborative Risk Management</p>
            </div>
            
            <div className="flex items-center">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden mr-3">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${viewMode === 'table' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setViewMode('table')}
                >
                  Table
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${viewMode === 'cards' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setViewMode('cards')}
                >
                  Cards
                </button>
              </div>
              
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-sm flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                Add Risk
              </button>
            </div>
          </div>
          
          {viewMode === 'table' ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Risk</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Customer Acquisition</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Customer Retention</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Other Costs</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Likelihood</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Effort</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Jira Stories</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Total Impact</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Expected</th>
                      <th className="py-4 px-4 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((row) => {
                      const totalImpact = row.customerAcquisition + row.customerRetention + row.otherCosts;
                      const expectedImpact = (totalImpact * (row.likelihood / 100)).toFixed(1);
                      const priority = calculatePriority(totalImpact, row.likelihood, row.effort);
                      const storyCompletion = calculateStoryCompletion(row.jiraStories);
                      
                      return (
                        <tr 
                          key={row.id} 
                          className={`${hoveredRow === row.id ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                          onMouseEnter={() => setHoveredRow(row.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="py-3 px-4 whitespace-nowrap">{row.product}</td>
                          <td className="py-3 px-4 whitespace-nowrap font-medium text-gray-900">{row.risk}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              row.riskType === "Operational" ? "bg-blue-100 text-blue-800" : 
                              row.riskType === "Security" ? "bg-red-100 text-red-800" : 
                              "bg-green-100 text-green-800"
                            }`}>
                              {row.riskType}
                            </span>
                          </td>
                          <td 
                            onClick={() => openDialog(row, "customerAcquisition")} 
                            className="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                          >
                            {getValueDisplay(row.customerAcquisition, true, false)}
                          </td>
                          <td 
                            onClick={() => openDialog(row, "customerRetention")} 
                            className="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                          >
                            {getValueDisplay(row.customerRetention, true, false)}
                          </td>
                          <td 
                            onClick={() => openDialog(row, "otherCosts")} 
                            className="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                          >
                            {getValueDisplay(row.otherCosts, true, false)}
                          </td>
                          <td 
                            onClick={() => openDialog(row, "likelihood")} 
                            className="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                          >
                            {getValueDisplay(row.likelihood, false, false)}
                          </td>
                          <td 
                            onClick={() => openDialog(row, "effort")} 
                            className="py-3 px-4 whitespace-nowrap cursor-pointer hover:bg-gray-100"
                          >
                            {getValueDisplay(row.effort, false, true)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <button 
                              onClick={() => openJiraStories(row)}
                              className="flex items-center space-x-2 hover:bg-blue-50 p-1 rounded transition-colors"
                            >
                              <div className="relative">
                                <div className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
                                  {row.jiraStories.length}
                                </div>
                                {row.jiraStories.length > 0 && (
                                  <div className="absolute bottom-0 right-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-blue-500" 
                                      style={{ width: `${storyCompletion}%` }}
                                    ></div>
                                  </div>
                                )}
                              </div>
                              <span className="text-blue-600 text-xs">
                                {row.jiraStories.length === 0 ? "Add" : "View"}
                              </span>
                            </button>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap font-bold text-gray-900">{totalImpact}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {expectedImpact}
                            </span>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              parseFloat(priority) > 2 ? "bg-red-100 text-red-800" : 
                              parseFloat(priority) > 1 ? "bg-yellow-100 text-yellow-800" : 
                              "bg-green-100 text-green-800"
                            }`}>
                              {priority}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((row) => {
                const totalImpact = row.customerAcquisition + row.customerRetention + row.otherCosts;
                const expectedImpact = (totalImpact * (row.likelihood / 100)).toFixed(1);
                const priority = calculatePriority(totalImpact, row.likelihood, row.effort);
                const storyCompletion = calculateStoryCompletion(row.jiraStories);
                const statusCounts = getStoryStatusSummary(row.jiraStories);
                
                return (
                  <div key={row.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{row.risk}</h3>
                          <p className="text-sm text-gray-500">{row.product}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          row.riskType === "Operational" ? "bg-blue-100 text-blue-800" : 
                          row.riskType === "Security" ? "bg-red-100 text-red-800" : 
                          "bg-green-100 text-green-800"
                        }`}>
                          {row.riskType}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Customer Acquisition</div>
                          <div onClick={() => openDialog(row, "customerAcquisition")} className="cursor-pointer">
                            {getValueDisplay(row.customerAcquisition, true, false)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Customer Retention</div>
                          <div onClick={() => openDialog(row, "customerRetention")} className="cursor-pointer">
                            {getValueDisplay(row.customerRetention, true, false)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Other Costs</div>
                          <div onClick={() => openDialog(row, "otherCosts")} className="cursor-pointer">
                            {getValueDisplay(row.otherCosts, true, false)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Likelihood</div>
                          <div onClick={() => openDialog(row, "likelihood")} className="cursor-pointer">
                            {getValueDisplay(row.likelihood, false, false)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                        <div>
                          <div className="text-xs text-gray-500">Total Impact</div>
                          <div className="font-bold">{totalImpact}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Expected</div>
                          <div className="font-bold">{expectedImpact}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Effort</div>
                          <div onClick={() => openDialog(row, "effort")} className="cursor-pointer">
                            {getValueDisplay(row.effort, false, true)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Priority</div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            parseFloat(priority) > 2 ? "bg-red-100 text-red-800" : 
                            parseFloat(priority) > 1 ? "bg-yellow-100 text-yellow-800" : 
                            "bg-green-100 text-green-800"
                          }`}>
                            {priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Team collaboration panel */}
        {showTeamPanel && (
          <div className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Team Members</h3>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowTeamPanel(false)}>
                <ChevronDown className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2">ONLINE - {onlineTeamMembers.filter(m => m.status === 'online').length}</div>
              {onlineTeamMembers.map((member) => (
                <div key={member.id} className="flex items-center py-2">
                  <div className="relative">
                    <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                      {member.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2">INVITE TEAM MEMBER</div>
              <div className="flex mb-2">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 border border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={teamInviteEmail}
                  onChange={(e) => setTeamInviteEmail(e.target.value)}
                />
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-r text-sm"
                  onClick={inviteTeamMember}
                >
                  Invite
                </button>
              </div>
              <p className="text-xs text-gray-500">Team members will receive real-time updates</p>
            </div>
            
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-2">TEAM CHAT</div>
              <div className="border border-gray-200 rounded p-3 bg-gray-50 flex items-center justify-center h-40 text-gray-400">
                <div className="text-center">
                  <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                  <p className="text-xs">Team chat coming soon</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCell && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded shadow w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center border-b pb-3">
              Planning Poker: {selectedCell.field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h2>
            
            <div className="grid grid-cols-3 gap-3 mb-6">
              {getOptions(selectedCell.field).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setVotes([...votes, option.value])}
                  className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded hover:bg-gray-50 hover:border-gray-300"
                >
                  <span className="text-3xl mb-1">{option.emoji}</span>
                  <span className="font-bold text-gray-700">{option.value}</span>
                  <span className="text-xs text-gray-500">{option.label}</span>
                </button>
              ))}
            </div>
            
            <div className="bg-gray-50 p-4 rounded mb-6">
              {!showVotes ? (
                <div className="text-center">
                  <div className="mb-2 text-gray-500">
                    {votes.length} votes collected
                  </div>
                  <button 
                    onClick={() => setShowVotes(true)} 
                    disabled={votes.length === 0}
                    className={`px-4 py-2 rounded font-medium ${
                      votes.length > 0 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Reveal Votes
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center gap-2 flex-wrap mb-3">
                    {votes.map((vote, index) => {
                      const mapping = selectedCell.field === "likelihood" 
                        ? likelihoodMapping 
                        : impactMapping;
                      
                      // Find the appropriate key (same logic as getValueDisplay)
                      let displayKey = vote;
                      if (selectedCell.field === "likelihood") {
                        const keys = Object.keys(mapping).map(Number).sort((a, b) => a - b);
                        for (let key of keys) {
                          if (key <= vote) displayKey = key;
                          else break;
                        }
                      } else {
                        displayKey = Math.floor(vote);
                      }
                      
                      const { emoji } = mapping[displayKey] || mapping[Object.keys(mapping)[0]];
                      
                      return (
                        <div key={index} className="flex items-center space-x-1 bg-white p-2 rounded border border-gray-200">
                          <span>{emoji}</span>
                          <span className="font-medium">{vote}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center font-medium">
                    Average: {calculateAverage(votes)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <div>
                <button 
                  onClick={() => setVotes([])} 
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 mr-2"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setSelectedCell(null)} 
                  className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
              <button 
                onClick={submitVote} 
                disabled={votes.length === 0} 
                className={`px-4 py-2 rounded font-medium ${
                  votes.length > 0 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}