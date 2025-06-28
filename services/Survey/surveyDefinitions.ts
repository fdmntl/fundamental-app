import { Question } from '~/components/Survey/QuestionCard';

export type SurveyTrigger = { type: 'app_launch'; count: number } | { type: 'immediate' };

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
