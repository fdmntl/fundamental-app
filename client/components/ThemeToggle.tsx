import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

import { useTheme } from './Wrappers/ThemeWrapper';

const ThemeToggle = () => {
  const { toggleTheme, theme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme}>
      {theme === 'light' ? (
        <Feather name="sun" size={42} color="white" />
      ) : (
        <Feather name="moon" size={42} color="white" />
      )}
    </TouchableOpacity>
  );
};

export default ThemeToggle;
