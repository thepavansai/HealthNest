import 'bootstrap-icons/font/bootstrap-icons.css';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-brand">HealthNest</h3>
            <p className="footer-description">
              Your trusted health partner, connecting you with expert doctors anytime, anywhere.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/faq">FAQs</a></li>
              <li><a href="/contactus">Contact Us</a></li>
              <li><a href="/aboutus">About Us</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Contact</h4>
            <div className="contact-info">
              <div className="contact-item">
                <i className="bi bi-telephone"></i>
                <span>+91 98765 43210</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-envelope"></i>
                <span>healthnest.contact@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-geo-alt"></i>
                <span>123 Health Street, Hyderabad, India</span>
              </div>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Follow Us</h4>
            <div className="social-links">
              <a href="https://www.facebook.com" className="social-link"><i className="bi bi-facebook"></i></a>
              <a href="https://www.twitter.com" className="social-link"><i className="bi bi-twitter"></i></a>
              <a href="https://www.instagram.com" className="social-link"><i className="bi bi-instagram"></i></a>
              <a href="https://www.linkedin.com" className="social-link"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <hr className="footer-divider" />
          <p className="copyright">© 2025 HealthNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;