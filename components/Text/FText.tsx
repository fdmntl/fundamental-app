import { Text } from 'react-native';

import { cn } from '~/utils/cn';

interface TitleProps {
  children: React.ReactNode;
  className?: string;
  italic?: boolean;
  medium?: boolean;
  bold?: boolean;
  allowFontScaling?: boolean;
}

export const FText = ({
  children,
  className,
  italic,
  medium,
  bold,
  allowFontScaling = true,
  ...props
}: TitleProps) => {
  let font = 'DMSans_400Regular';
  if (medium) font = 'DMSans_500Medium';
  if (bold) font = 'DMSans_700Bold';
  if (italic) font += '_Italic';

  return (
    <Text
      className={cn('text-text', className)}
      style={{ fontFamily: font }}
      allowFontScaling={allowFontScaling}
      {...props}>
      {children}
    </Text>
  );
};
