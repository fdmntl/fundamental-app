import React, { useState } from 'react';
import { Modal, View, SafeAreaView } from 'react-native';

import { Button } from '~/components/Button';
import { trackEvent } from '~/services/PostHog/trackEvent';
import { Question, QuestionCard } from './QuestionCard';

interface SurveyModalProps {
  surveyName: string;
  questions: Question[];
  isVisible: boolean;
  onClose: () => void;
}

export const SurveyModal = ({ surveyName, questions, isVisible, onClose }: SurveyModalProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  const handleAnswerChange = (answer: any) => {
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    const payload: {
      survey_name: string;
      survey_answer?: number;
      survey_feedback?: string;
    } = {
      survey_name: surveyName,
    };

    for (const questionId in answers) {
      if (Object.prototype.hasOwnProperty.call(answers, questionId)) {
        const question = questions.find((q) => q.id === questionId);
        if (question) {
          if (question.type === 'free_text') {
            payload.survey_feedback = answers[questionId];
          } else {
            payload.survey_answer = answers[questionId];
          }
        }
      }
    }

    if (payload.survey_answer || payload.survey_feedback) {
      trackEvent('survey_answer', payload);
    }

    onClose();
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 p-4">
          <QuestionCard
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswerChange}
          />
          <View className="pb-4">
            {isLastQuestion ? (
              <Button title="Submit" onPress={handleSubmit} />
            ) : (
              <Button title="Next" onPress={handleNext} />
            )}
            <Button title="Close" onPress={onClose} disableGradient textClassName="text-text" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
