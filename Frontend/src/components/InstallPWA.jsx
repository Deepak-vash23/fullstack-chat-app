import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      console.log('beforeinstallprompt fired');
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('App is already installed');
        setIsInstallable(false);
      } else {
        console.log('App is not installed');
      }
    };

    // Initial check
    checkInstalled();

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if running in Edge
    const isEdge = navigator.userAgent.includes("Edg");
    if (isEdge) {
      console.log('Running in Edge browser');
      // Edge specific handling if needed
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No installation prompt available');
      return;
    }

    try {
      // Show the install prompt
      console.log('Triggering install prompt');
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Installation ${outcome}`);
      
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }

      // Clear the deferredPrompt for the next time
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  // Show install button even if deferredPrompt is null (for testing)
  return (
    <button
      onClick={handleInstallClick}
      className="btn btn-primary btn-sm gap-2"
    >
      <Download className="w-4 h-4" />
      Install App
    </button>
  );
};

export default InstallPWA; 