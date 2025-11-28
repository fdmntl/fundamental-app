import { cssInterop } from 'nativewind';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

cssInterop(Path, {
  className: {
    target: true,
    nativeStyleToProp: {
      color: 'stroke',
    },
  },
});

interface WavyLineProps {
  className?: string;
}

export function WavyLine({ className }: WavyLineProps) {
  return (
    <View className="h-8 w-full">
      <Svg width="100%" height="32" viewBox="0 0 400 32">
        <Path
          d="M0,16 Q12.5,8 25,16 T50,16 T75,16 T100,16 T125,16 T150,16 T175,16 T200,16 T225,16 T250,16 T275,16 T300,16 T325,16 T350,16 T375,16 T400,16"
          // @ts-ignore - cssInterop adds className support
          className={className}
          strokeWidth="2"
          fill="none"
        />
      </Svg>
    </View>
  );
}
