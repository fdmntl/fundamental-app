import { useState, useEffect } from 'react';

import { USER_SATISFACTION_SURVEY, NPS_SURVEY } from '~/services/Survey/surveyDefinitions';
import { getItem, setItem } from '~/utils/Storage/asyncStorage';

const SURVEY_COMPLETED_KEY = 'survey_completed_';
const APP_LAUNCH_COUNT_KEY = 'app_launch_count';

const surveyMap = {
  user_satisfaction: USER_SATISFACTION_SURVEY,
  nps: NPS_SURVEY,
};

export const useSurveyManager = (surveyName: keyof typeof surveyMap) => {
  const [isSurveyVisible, setSurveyVisible] = useState(false);
  const survey = surveyMap[surveyName] || null;

  useEffect(() => {
    if (!survey) return;

    const checkSurveyStatus = async () => {
      const surveyCompleted = await getItem(SURVEY_COMPLETED_KEY + surveyName);
      if (surveyCompleted) {
        return;
      }

      const { trigger } = survey;
      switch (trigger.type) {
        case 'app_launch': {
          const launchCount = (await getItem(APP_LAUNCH_COUNT_KEY)) || 0;
          console.log('launchCount', launchCount, 'trigger:', trigger.count);
          if (launchCount >= trigger.count) {
            setSurveyVisible(true);
          }
          break;
        }
        case 'immediate': {
          setSurveyVisible(true);
          break;
        }
        default:
          break;
      }
    };

    checkSurveyStatus();
  }, [survey]);

  const handleCloseSurvey = async () => {
    setSurveyVisible(false);
    await setItem(SURVEY_COMPLETED_KEY + surveyName, true);
  };

  return {
    isSurveyVisible,
    survey,
    handleCloseSurvey,
  };
};
