import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key: any, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getItem = async (key: any) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

export const removeItem = async (key: any) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item:', error);
  }
};

export const mergeItem = async (key: any, value: any) => {
  try {
    await AsyncStorage.mergeItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error merging item:', error);
  }
};

export const clear = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    return [];
  }
};

export const getAllItems = async () => {
  try {
    const keys: any = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    return items.reduce(
      (accumulator: { [key: string]: any }, [key, value]) => {
        accumulator[key] = JSON.parse(value || 'null');
        return accumulator;
      },
      {} as { [key: string]: any }
    );
  } catch (error) {
    console.error('Error getting all items:', error);
    return {};
  }
};

export const hasSeenOnboarding = async (): Promise<boolean> => {
  const value = await getItem('hasSeenOnboardingScreen');
  return value === 'true';
};

export const markOnboardingAsSeen = async (): Promise<void> => {
  await setItem('hasSeenOnboardingScreen', 'true');
};

export const resetOnboardingSeen = async (): Promise<void> => {
  await setItem('hasSeenOnboardingScreen', 'false');
};
