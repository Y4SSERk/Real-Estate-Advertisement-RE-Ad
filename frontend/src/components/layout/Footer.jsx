import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>RE-Ad</h3>
          <p>Your trusted real estate marketplace for finding your dream property in Morocco.</p>
          <div className="social-icons">
            <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
            <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Property Types</h3>
          <ul className="footer-links">
            <li><Link to="/properties?type=apartment">Apartments</Link></li>
            <li><Link to="/properties?type=house">Houses</Link></li>
            <li><Link to="/properties?type=villa">Villas</Link></li>
            <li><Link to="/properties?type=office">Commercial</Link></li>
            <li><Link to="/properties?type=land">Land</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul className="contact-info">
            <li><i className="fas fa-map-marker-alt"></i> 123 Real Estate Ave, Casablanca, Morocco</li>
            <li><i className="fas fa-phone"></i> +212 5XX-XXXXXX</li>
            <li><i className="fas fa-envelope"></i> info@read-estate.com</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} RE-Ad. All rights reserved.</p>
        <div className="footer-bottom-links">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
