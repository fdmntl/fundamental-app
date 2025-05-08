import { InsertSupabaseData } from './Supabase/insertData';

import { posthog } from '~/utils/postHogClient';

interface SendFeedbackPayload {
  screen: string;
  type: string;
  text: string;
}

async function sendFeedbackToSupaBase(payload: SendFeedbackPayload) {
  const { screen, type, text } = payload;

  try {
    await InsertSupabaseData({
      tableName: 'user_feedback',
      data: [
        {
          screen,
          type,
          text,
        },
      ],
    });
  } catch (error) {
    console.error('Unexpected error while sending feedback:', error);
  }
}

function sendFeedbackToPostHog(payload: SendFeedbackPayload) {
  const { screen, type, text } = payload;

  posthog.capture('feedback', {
    screen,
    type,
    text,
    created_at: new Date(),
  });
}

export async function sendFeedback(payload: SendFeedbackPayload) {
  await sendFeedbackToSupaBase(payload);
  sendFeedbackToPostHog(payload);
}
