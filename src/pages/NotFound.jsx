import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>4😮4</h1>
        <h2>عذراً! الصفحة غير موجودة</h2>
        <p>يبدو أن الصفحة التي تبحث عنها قد ضلت طريقها في الفضاء الإلكتروني</p>
        <Link to="/" className="home-button">
          العودة للصفحة الرئيسية
        </Link>
      </div>
      <div className="stars"></div>
    </div>
  );
}

export default NotFound; 