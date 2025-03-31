import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
}

export const FTitle = ({ children, className, italic, ...props }: TitleProps) => {
  return (
    <Text className={`${className} text-text`} style={{ fontFamily: 'Inter_700Bold' }} {...props}>
      {children}
    </Text>
  );
};
