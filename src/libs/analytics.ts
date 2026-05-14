type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __karaAnalyticsConsentGranted?: boolean;
};

function getAnalyticsWindow() {
  if (typeof window === "undefined") {
    return null;
  }

  return window as AnalyticsWindow;
}

export function isAnalyticsEnabled() {
  const analyticsWindow = getAnalyticsWindow();

  return analyticsWindow?.__karaAnalyticsConsentGranted === true;
}

export function trackEvent(
  eventName: string,
  params: Record<string, string | number | boolean | null> = {},
) {
  if (!isAnalyticsEnabled()) {
    return;
  }

  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow) {
    return;
  }

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, params);
    return;
  }

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push({
    event: eventName,
    ...params,
  });
}

export function trackPageView(path: string) {
  const analyticsWindow = getAnalyticsWindow();

  if (!analyticsWindow) {
    return;
  }

  trackEvent("page_view", {
    page_path: path,
    page_location: analyticsWindow.location.href,
    page_title: document.title,
  });
}
