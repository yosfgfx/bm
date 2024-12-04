import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <nav>
          <ul>
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/about">من نحن</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </nav>
      </header>
      <main className="home-main">
        <h1>مرحباً بكم في موقعنا</h1>
        <p>نحن نقدم لكم أفضل الخدمات والمنتجات</p>
        <div className="cta-buttons">
          <button className="primary-button">ابدأ الآن</button>
          <button className="secondary-button">اكتشف المزيد</button>
        </div>
      </main>
    </div>
  );
}

export default Home; 