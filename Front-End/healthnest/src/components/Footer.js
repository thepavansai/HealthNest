import 'bootstrap-icons/font/bootstrap-icons.css';
const Footer = () => {
return (
<footer className="bg-dark text-light pt-5 pb-4 mt-5">
<div className="container">
<div className="row">


        {/* Company Info */}
        <div className="col-md-3 mb-4">
          <h5 className="text-uppercase mb-3">HealthNest</h5>
          <p>Your trusted health partner, connecting you with expert doctors anytime, anywhere.</p>
        </div>

        {/* Quick Links */}
        <div className="col-md-3 mb-4">
          <h5 className="text-uppercase mb-3">Quick Links</h5>
          <ul className="list-unstyled">
            <li><a href="/faq" className="text-light text-decoration-none">FAQs</a></li>
            <li><a href="/contact" className="text-light text-decoration-none">Contact Us</a></li>
            <li><a href="/about" className="text-light text-decoration-none">About Us</a></li>
            <li><a href="/terms" className="text-light text-decoration-none">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="col-md-3 mb-4">
          <h5 className="text-uppercase mb-3">Contact</h5>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Email:</strong> support@mediconnect.com</p>
          <p><strong>Address:</strong> 123 Health Street, Hyderabad, India</p>
        </div>

        {/* Social Media */}
        <div className="col-md-3 mb-4">
          <h5 className="text-uppercase mb-3">Follow Us</h5>
          <a href="#" className="text-light me-3 fs-5"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-light me-3 fs-5"><i className="bi bi-twitter"></i></a>
          <a href="#" className="text-light me-3 fs-5"><i className="bi bi-instagram"></i></a>
          <a href="#" className="text-light fs-5"><i className="bi bi-linkedin"></i></a>
        </div>
      </div>

      <hr className="bg-secondary" />
      <p className="text-center mb-0">© 2025 HealthNest. All rights reserved.</p>
    </div>
  </footer>
);
};

export default Footer;