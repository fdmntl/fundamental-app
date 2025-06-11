import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

import { useTheme } from './Wrappers/ThemeWrapper';
import { setItem } from '~/utils/Storage/asyncStorage';

const ThemeToggle = () => {
  const { toggleTheme, theme } = useTheme();

  useEffect(() => {
    setItem('theme', theme);
  }, [theme]);

  const handlePress = () => {
    toggleTheme();
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {theme === 'light' ? (
        <Feather name="sun" size={42} color="black" />
      ) : (
        <Feather name="moon" size={42} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default ThemeToggle;
