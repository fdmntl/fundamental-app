import React, { useState } from 'react';
import { Modal, View, SafeAreaView } from 'react-native';

import { Question, QuestionCard } from './QuestionCard';

import { Button } from '~/components/Button';
import { trackEvent } from '~/services/PostHog/trackEvent';

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

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const answer = answers[currentQuestion.id];

    if (answer === undefined || answer === null || answer === '') {
      return;
    }

    const payload: {
      survey_name: string;
      question_id: string;
      question_index: number;
      survey_answer?: any;
      survey_feedback?: string;
    } = {
      survey_name: surveyName,
      question_id: currentQuestion.id,
      question_index: currentQuestionIndex,
    };

    if (currentQuestion.type === 'free_text') {
      payload.survey_feedback = answer;
    } else {
      payload.survey_answer = answer;
    }
    trackEvent('survey_answer', payload);
  };

  const handleNext = () => {
    submitAnswer();
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    submitAnswer();
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
            <Button title="Close" onPress={onClose} disableGradient textClassName="text-xs" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
