import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__top">
          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighborhood concern</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#">Airbnb your home</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">Join a free Hosting class</a></li>
              <li><a href="#">Find a co‑host</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Airbnb</h4>
            <ul>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">New features</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Gift cards</a></li>
              <li><a href="#">Emergency stays</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <div className="footer__bottom-left">
            <span>© 2026 Airbnb, Inc.</span>
            <span className="footer__dot" />
            <a href="#">Privacy</a>
            <span className="footer__dot" />
            <a href="#">Terms</a>
            <span className="footer__dot" />
            <a href="#">Sitemap</a>
            <span className="footer__dot" />
            <a href="#">Company details</a>
          </div>
          <div className="footer__bottom-right">
            <button className="footer__lang-btn">🌐 English (IN)</button>
            <button className="footer__lang-btn">₹ INR</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
