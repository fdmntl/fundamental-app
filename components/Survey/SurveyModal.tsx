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
    const currentQuestion = questions[currentQuestionIndex];
    const finalAnswer = { ...answers, [currentQuestion.id]: answers[currentQuestion.id] };

    // Track each answer as a separate event
    Object.keys(finalAnswer).forEach((questionId) => {
      trackEvent('survey_answer', {
        survey_name: surveyName,
        question_id: questionId,
        survey_answer: finalAnswer[questionId],
      });
    });

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
