import { posthog } from '~/utils/postHogClient';

export function trackEvent(name: string, properties?: Record<string, any>) {
  posthog.capture(name, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
}
