import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Weq@Ah') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-gradient p-4">
      <div className="glass-effect rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white text-center mb-6 font-['SSTArabic-Bold']">
          تسجيل دخول المسؤول
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
              dir="ltr"
            />
          </div>
          <div>
            <label className="block text-white mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:border-white/40 focus:outline-none"
              dir="ltr"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
};
