import { useState, useEffect } from 'react';

import { USER_SATISFACTION_SURVEY, NPS_SURVEY } from '~/services/Survey/surveyDefinitions';
import { getItem, setItem } from '~/utils/Storage/asyncStorage';

const SURVEY_COMPLETED_KEY = 'survey_completed_';

const surveyMap = {
  user_satisfaction: USER_SATISFACTION_SURVEY,
  nps: NPS_SURVEY,
};

export const useSurveyManager = (surveyName: keyof typeof surveyMap) => {
  const [isSurveyVisible, setSurveyVisible] = useState(false);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(true);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      // const surveyCompleted = await getItem(SURVEY_COMPLETED_KEY + surveyName);
      // if (surveyCompleted === 'true') {
      //   setHasCompletedSurvey(true);
      // } else {
      setHasCompletedSurvey(false);
      // For now, we will trigger the survey to be visible as soon as the app loads
      // and the user has not completed it.
      // In the future, we can add more complex logic here to determine when to show the survey.
      setSurveyVisible(true);
      // }
    };

    checkSurveyStatus();
  }, [surveyName]);

  const handleCloseSurvey = async () => {
    setSurveyVisible(false);
    // When the survey is closed, we mark it as completed for the user.
    // await setItem(SURVEY_COMPLETED_KEY + surveyName, 'true');
    setHasCompletedSurvey(true);
  };

  const survey = surveyMap[surveyName] || null;

  return {
    isSurveyVisible,
    survey,
    handleCloseSurvey,
    hasCompletedSurvey,
  };
};
