import { Text } from 'react-native';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  allowFontScaling?: boolean;
}

export const FTitle = ({ children, className, allowFontScaling = true, ...props }: TitleProps) => {
  return (
    <Text
      className={`${className} text-text`}
      style={{ fontFamily: 'Inter_700Bold' }}
      allowFontScaling={allowFontScaling}
      {...props}>
      {children}
    </Text>
  );
};
