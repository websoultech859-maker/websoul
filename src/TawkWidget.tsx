import { useEffect } from 'react';

declare global {
  interface Window {
    Tawk_API?: Record<string, any>;
    Tawk_LoadStart?: Date;
  }
}

export function TawkWidget() {
  useEffect(() => {
    const PROPERTY_ID = '6a844c235c004f3449daa693';
    const WIDGET_ID = '1k0aciqod';
    const scriptSrc = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;

    // Initialize global Tawk_API and Tawk_LoadStart objects
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();

    // Configure custom style and positioning options
    window.Tawk_API.customStyle = {
      zIndex: 990,
      visibility: {
        desktop: {
          position: 'br',
          xOffset: 20,
          yOffset: 20,
        },
        mobile: {
          position: 'br',
          xOffset: 15,
          yOffset: 15,
        },
      },
    };

    // Prevent duplicate script injection
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      return;
    }

    // Inject the Tawk.to script asynchronously
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = scriptSrc;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  return null;
}
