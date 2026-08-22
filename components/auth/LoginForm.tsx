'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createClient } from '@/utils/supabase/client';

const INVALID_CREDENTIALS_MESSAGE = 'Email o contraseña incorrectos';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(INVALID_CREDENTIALS_MESSAGE);
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-xs font-bold tracking-wider text-[#94887B] mb-2">EMAIL</div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        className="w-full p-3.5 px-4 rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-base text-[#3F362E] mb-4 placeholder:text-[#B6A99B]"
      />

      <div className="text-xs font-bold tracking-wider text-[#94887B] mb-2">CONTRASEÑA</div>
      <input
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        className="w-full p-3.5 px-4 rounded-[14px] border-[1.5px] border-[#EADFD0] bg-white text-base text-[#3F362E] mb-2.5 placeholder:text-[#B6A99B]"
      />

      {/* Forgot password */}
      <div className="text-right mb-5">
        <span className="text-[#C5503A] text-[13.5px] font-bold cursor-default">
          ¿Olvidaste tu contraseña?
        </span>
      </div>

      {/* Login button */}
      <button
        type="submit"
        disabled={loading}
        className="block text-center w-full p-4 rounded-[15px] bg-linear-to-b from-[#F4977E] to-[#EE8164] text-white font-extrabold text-base cursor-pointer shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Ingresando…' : 'Iniciar sesión'}
      </button>

      {error && (
        <p className="mt-4 text-center text-[13px] font-medium text-[#D9583C]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
