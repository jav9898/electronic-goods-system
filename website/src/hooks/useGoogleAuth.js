import { useState, useEffect } from 'react';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = (callback) => {
    if (!isGoogleLoaded || !window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: callback,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  };

  const signInWithGoogle = (callback) => {
    if (!isGoogleLoaded || !window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    initializeGoogleSignIn(callback);
    window.google.accounts.id.prompt();
  };

  const renderGoogleButton = (elementId, callback) => {
    if (!isGoogleLoaded || !window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    initializeGoogleSignIn(callback);
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'outline',
        size: 'large',
        width: '100%',
        text: 'signin_with',
        shape: 'rectangular',
      }
    );
  };

  return {
    isGoogleLoaded,
    signInWithGoogle,
    renderGoogleButton,
  };
};

export default useGoogleAuth;
