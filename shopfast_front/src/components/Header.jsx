// components/Header.jsx
import { ShoppingCart, LogOut, User, Sparkles } from 'lucide-react';

const Header = ({ user, onLogout }) => {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="">
            <div className="">
              
            </div>
            <div>
              
            </div>
          </div>

          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="user-details">
                <p className="user-name">{user?.username}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="btn-logout"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;