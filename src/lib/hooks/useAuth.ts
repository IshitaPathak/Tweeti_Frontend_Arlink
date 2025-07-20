'use client';

import { useState, useEffect } from 'react';

export default function useAuth() {
  const [session, setSession] = useState<null | { user: { email: string }, githubUsername?: string }>(null);

  useEffect(() => {
    // Check if we have a code from GitHub OAuth
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // Exchange code for session
      fetch(`https://tweeti-backend.vercel.app/api/auth/github/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.githubUsername) {
            setSession({
              user: { email: data.githubUsername },
              githubUsername: data.githubUsername
            });
            localStorage.setItem('githubUsername', data.githubUsername);
            // Clear the URL parameters
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        })
        .catch(console.error);
    }
  }, []);

  const signIn = async () => {
    // Redirect to backend GitHub auth
    window.location.href = `https://tweeti-backend.vercel.app/api/auth/github`;
  };

  const signOut = () => {
    setSession(null);
  };

  return {
    session,
    signIn,
    signOut
  };
}
