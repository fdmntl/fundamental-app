import { useState, useEffect } from 'react';

import { NPS_SURVEY, USER_SATISFACTION_SURVEY, Survey } from '~/services/Survey/surveyDefinitions';
import { getItem, setItem } from '~/utils/Storage/asyncStorage';

const SURVEY_COMPLETED_KEY = 'survey_completed_';
const APP_LAUNCH_COUNT_KEY = 'app_launch_count';

// The order of this array determines priority.
// The first survey whose trigger conditions are met will be shown.
const surveys = [USER_SATISFACTION_SURVEY, NPS_SURVEY];

export const useSurveyManager = () => {
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);
  const [isSurveyVisible, setSurveyVisible] = useState(false);

  useEffect(() => {
    const findActiveSurvey = async () => {
      for (const survey of surveys) {
        const surveyCompleted = await getItem(SURVEY_COMPLETED_KEY + survey.name);
        if (surveyCompleted) {
          continue; // Already completed, check next survey
        }

        const { trigger } = survey;
        let triggerMet = false;
        switch (trigger.type) {
          case 'app_launch': {
            const launchCount = (await getItem(APP_LAUNCH_COUNT_KEY)) || 0;
            if (launchCount >= trigger.count) {
              triggerMet = true;
            }
            break;
          }
          case 'immediate': {
            triggerMet = true;
            break;
          }
          default:
            break;
        }

        if (triggerMet) {
          setActiveSurvey(survey);
          setSurveyVisible(true);
          return; // Stop after finding the first survey to show
        }
      }
    };
    findActiveSurvey();
  }, []);

  const handleCloseSurvey = async () => {
    if (activeSurvey) {
      setSurveyVisible(false);
      await setItem(SURVEY_COMPLETED_KEY + activeSurvey.name, true);
    }
  };

  return {
    isSurveyVisible,
    survey: activeSurvey,
    handleCloseSurvey,
  };
};
