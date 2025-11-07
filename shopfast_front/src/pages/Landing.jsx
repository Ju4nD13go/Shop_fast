// pages/Landing.jsx
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, CheckCircle, Users, BarChart3, Sparkles } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="landing-logo">
          <ShoppingCart className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="landing-title">
          Mini Lista de Compras
        </h1>
        
        <p className="landing-subtitle">
          La forma más inteligente de organizar tus compras. 
          Crea listas, gestiona productos y simplifica tu vida.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="landing-btn landing-btn-primary">
            <Sparkles className="w-5 h-5" />
            Comenzar Ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/register" className="landing-btn landing-btn-secondary">
            Crear Cuenta
          </Link>
        </div>

        <div className="landing-features">
          <div className="feature-item feature-1">
            <div className="feature-icon">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h4>Fácil de Usar</h4>
            <p>Interfaz intuitiva y moderna</p>
          </div>
          
          <div className="feature-item feature-2">
            <div className="feature-icon">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h4>Organizado</h4>
            <p>Múltiples listas personalizadas</p>
          </div>
          
          <div className="feature-item feature-3">
            <div className="feature-icon">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4>Estadísticas</h4>
            <p>Sigue tu progreso en tiempo real</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;