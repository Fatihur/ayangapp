import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface AuthModalProps {
  onAuth: (isAuthenticated: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuth }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize the input by removing case sensitivity and extra spaces
    const normalizedAnswer = answer.toLowerCase().trim();
    const validAnswers = [
      '6 november 2021',
      '6 nov 2021',
      '6nov2021',
      '6/11/2021',
      '06/11/2021',
      '06 november 2021',
      '06 nov 2021'
    ];

    if (validAnswers.includes(normalizedAnswer)) {
      onAuth(true);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Halo Sayang 💕</h2>
          <p className="text-gray-600">Sebelum masuk, jawab dulu ya</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
              Tanggal berapa kita jadian?
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                setError(false);
              }}
              placeholder="contoh: 8 Agustus 2024 atau 8/8/2024"
              className={`w-full px-4 py-3 rounded-xl border ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 text-center">
                Jawaban salah sayang, coba ingat-ingat lagi ya 😊
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
};
