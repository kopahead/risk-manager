import { NavLink } from 'react-router-dom';

export default function SidebarNavigation({ onAddRisk, onLogin, onLogout, isAuthenticated }) {
  return (
    <nav className="border-b border-gray-300 pt-2 pb-1">
      <div className="flex items-center">
        <span className="font-bold mr-4">Risk Management</span>
        <NavLink 
          to="/"
          className={({ isActive }) => 
            `mr-3 ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:underline'}`
          }
          end
        >
          Risks
        </NavLink>
        <NavLink 
          to="/analytics"
          className={({ isActive }) => 
            `mr-3 ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:underline'}`
          }
        >
          Analytics
        </NavLink>
        <span className="mx-1 text-gray-500">|</span>
        <button
          onClick={onAddRisk}
          className="mr-3 text-gray-600 hover:underline"
        >
          Add Risk
        </button>
        
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="text-gray-600 hover:underline"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="text-gray-600 hover:underline"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}