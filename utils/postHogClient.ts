import PostHog from 'posthog-react-native';

const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;

if (!POSTHOG_KEY) {
  throw new Error('POSTHOG_KEY is not defined in the environment variables.');
}

export const posthog = new PostHog(POSTHOG_KEY, {
  host: 'https://eu.i.posthog.com',
});
