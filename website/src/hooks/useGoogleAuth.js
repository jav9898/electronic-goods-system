import { useState, useEffect } from 'react';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Identity Services script (required for new OAuth clients)
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Google Identity Services');
      setIsGoogleLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      try {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      } catch (error) {
        console.warn('Error removing Google script:', error);
      }
    };
  }, []);

  const signInWithGoogle = (callback) => {
    if (!isGoogleLoaded || !window.google) {
      console.error('Google Identity Services not loaded');
      callback({ error: 'Google Sign-In not available' });
      return;
    }

    try {
      console.log('Initializing Google Sign-In with Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
      
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: (response) => {
          console.log('Google Sign-In response:', response);
          callback(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false, // Disable FedCM for better compatibility
      });

      // Trigger the Google Sign-In popup
      window.google.accounts.id.prompt((notification) => {
        console.log('Google prompt notification:', notification);
        if (notification.isNotDisplayed()) {
          console.log('Google prompt not displayed - trying alternative method');
          // Fallback: create a temporary button and click it
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
          
          window.google.accounts.id.renderButton(tempDiv, {
            theme: 'outline',
            size: 'large',
          });
          
          // Simulate button click
          setTimeout(() => {
            const button = tempDiv.querySelector('div[role="button"]');
            if (button) {
              button.click();
            }
            document.body.removeChild(tempDiv);
          }, 100);
        }
      });
    } catch (error) {
      console.error('Google Sign-In initialization error:', error);
      callback({ error: 'Google Sign-In failed to initialize' });
    }
  };

  const renderGoogleButton = (elementId, callback) => {
    if (!isGoogleLoaded || !window.google) {
      console.error('Google Identity Services not loaded');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: callback,
      });

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
    } catch (error) {
      console.error('Google button render error:', error);
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle,
    renderGoogleButton,
  };
};

export default useGoogleAuth;
