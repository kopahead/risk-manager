export const RISK_OPTIONS = {
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
  
  export const getEmojiForCategory = (category) => {
    const emojis = {
      Operational: '⚙️',
      Security: '🔒',
      Regulatory: '📜'
    };
    return emojis[category] || '📋';
  };