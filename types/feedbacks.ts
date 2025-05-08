export enum FeedbackType {
  Bug = 'bug',
  FeatureRequest = 'feature_request',
  UiIssue = 'ui_issue',
  DesignCritique = 'design_critique',
  PerformanceIssue = 'performance_issue',
  Other = 'other',
}

export enum ScreenName {
  Home = 'home',
  Assets = 'assets',
  Trade = 'trade',
  Earn = 'earn',
  Send = 'send',
  Profile = 'profile',
  Other = 'other',
}

export const FeedbackTypeLabels: Record<FeedbackType, string> = {
  [FeedbackType.Bug]: 'Bug Report',
  [FeedbackType.FeatureRequest]: 'Feature Request',
  [FeedbackType.UiIssue]: 'UI Issue',
  [FeedbackType.DesignCritique]: 'Design Critique',
  [FeedbackType.PerformanceIssue]: 'Performance Issue',
  [FeedbackType.Other]: 'Other',
};

export const ScreenNameLabels: Record<ScreenName, string> = {
  [ScreenName.Home]: 'Home',
  [ScreenName.Assets]: 'Assets',
  [ScreenName.Trade]: 'Trade',
  [ScreenName.Earn]: 'Earn',
  [ScreenName.Send]: 'Send',
  [ScreenName.Profile]: 'Profile',
  [ScreenName.Other]: 'Other',
};
