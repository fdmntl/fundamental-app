import { Question } from '~/components/Survey/QuestionCard';

export type SurveyTrigger =
  | { type: 'app_launch'; count: number }
  | { type: 'immediate' }
  | { type: 'manual' };

export interface Survey {
  name: string;
  questions: Question[];
  trigger: SurveyTrigger;
}

export const USER_SATISFACTION_SURVEY: Survey = {
  name: 'user_satisfaction',
  questions: [
    {
      id: 'satisfaction_rating',
      text: 'How satisfied are you with Fundamental?',
      type: 'number_range',
      data: {
        from: 1,
        to: 5,
      },
    },
    {
      id: 'feedback_text',
      text: 'What is the main reason for your score?',
      type: 'free_text',
      data: {
        placeholder: 'Your feedback helps us improve!',
      },
    },
  ],
  trigger: { type: 'app_launch', count: 2 },
};

export const NPS_SURVEY: Survey = {
  name: 'nps',
  questions: [
    {
      id: 'nps_rating',
      text: 'How likely are you to recommend Fundamental to a friend or colleague?',
      type: 'number_range',
      data: {
        from: 0,
        to: 10,
      },
    },
    {
      id: 'nps_feedback',
      text: 'What is the primary reason for your score?',
      type: 'free_text',
      data: {
        placeholder: 'Your feedback helps us improve!',
      },
    },
  ],
  trigger: { type: 'app_launch', count: 4 },
};

export const FIRST_TIME_USER_SURVEY: Survey = {
  name: 'first_time_user',
  questions: [
    {
      id: 'crypto_experience',
      text: 'Have you used crypto wallets before?',
      type: 'multiple_choice',
      data: {
        options: ['Yes', 'No'],
      },
    },
    {
      id: 'referral_source',
      text: 'How did you hear about Fundamental?',
      type: 'multiple_choice',
      data: {
        options: ['Friend', 'Twitter', 'Newsletter', 'Other'],
      },
    },
    {
      id: 'user_goal',
      text: 'What brings you to Fundamental?',
      type: 'multiple_choice',
      data: {
        options: ['Buying assets', 'Sending money', 'Exploring', 'Other'],
      },
    },
    {
      id: 'crypto_goal',
      text: 'What is your main goal with crypto?',
      type: 'free_text',
      data: {
        placeholder: 'Tell us about your goals...',
      },
    },
  ],
  trigger: { type: 'manual' },
};
