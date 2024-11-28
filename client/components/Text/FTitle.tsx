import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
}

export const FTitle = ({ children, className, italic, ...props }: TitleProps) => {
  const font = italic ? 'DMSerifText_400Regular_Italic' : 'DMSerifText_400Regular';

  return (
    <Text className={`${className} text-text`} style={{ fontFamily: font }} {...props}>
      {children}
    </Text>
  );
};
