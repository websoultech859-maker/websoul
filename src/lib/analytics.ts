/**
 * Google Analytics 4 (GA4) Utility Module for WebSoul (https://www.websoul.tech)
 * Measurement ID: G-F64N2LC4LV
 */

export const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
  'G-F64N2LC4LV';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track SPA page views with Google Analytics 4 across client-side navigations
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: url,
      page_title: title || document.title,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}

/**
 * Track custom user interactions or events in GA4
 */
export function trackEvent(action: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, {
      ...params,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}
