import { NavLink } from 'react-router-dom';

export default function SidebarNavigation({ onAddRisk, onLogin, onLogout, isAuthenticated }) {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Risk Management</h1>
      </div>
      
      <nav className="flex flex-col space-y-2">
        <NavLink 
          to="/"
          className={({ isActive }) => 
            `px-4 py-2 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
          end
        >
          Risk List
        </NavLink>
        
        <NavLink 
          to="/analytics"
          className={({ isActive }) => 
            `px-4 py-2 rounded transition ${isActive ? 'bg-blue-600' : 'hover:bg-gray-700'}`
          }
        >
          Analytics
        </NavLink>
        
        <button
          onClick={onAddRisk}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          Add New Risk
        </button>
        
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={onLogin}
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Login
          </button>
        )}
      </nav>
    </aside>
  );
}