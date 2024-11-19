import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
  medium?: boolean;
  bold?: boolean;
}

const FText = ({ children, className, italic, medium, bold, ...props }: TitleProps) => {
  let font = 'DMSans_400Regular';
  if (medium) font = 'DMSans_500Medium';
  if (bold) font = 'DMSans_700Bold';
  if (italic) font += '_Italic';

  return (
    <Text className={`${className} text-xl text-text`} style={{ fontFamily: font }} {...props}>
      {children}
    </Text>
  );
};

export default FText;
