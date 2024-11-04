import {
  useFonts,
  DMSerifText_400Regular,
  DMSerifText_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-text';
import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
}

const FTitle = ({ children, className, italic, ...props }: TitleProps) => {
  const [fontsLoaded] = useFonts({
    DMSerifText_400Regular,
    DMSerifText_400Regular_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  const font = italic ? 'DMSerifText_400Regular_Italic' : 'DMSerifText_400Regular';

  return (
    <Text className={`${className} text-text`} style={{ fontFamily: font }} {...props}>
      {children}
    </Text>
  );
};

export default FTitle;
