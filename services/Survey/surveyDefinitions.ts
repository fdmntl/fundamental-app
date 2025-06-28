import { Question } from '~/components/Survey/QuestionCard';

export const USER_SATISFACTION_SURVEY = {
  name: 'user_satisfaction',
  questions: [
    {
      id: 'satisfaction_rating',
      text: 'How satisfied are you with the app?',
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
        placeholder: 'Your feedback is valuable to us!',
      },
    },
  ] as Question[],
};

export const NPS_SURVEY = {
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
  ] as Question[],
};
