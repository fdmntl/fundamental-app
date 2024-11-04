import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
  medium?: boolean;
  bold?: boolean;
}

const FText = ({ children, className, italic, medium, bold, ...props }: TitleProps) => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }

  let font = 'DMSans_400Regular';
  if (medium) font = 'DMSans_500Medium';
  if (bold) font = 'DMSans_700Bold';
  if (italic) font += '_Italic';

  return (
    <Text
      className={`${className} text-text`}
      style={{ fontFamily: font, fontSize: 18 }}
      {...props}>
      {children}
    </Text>
  );
};

export default FText;
