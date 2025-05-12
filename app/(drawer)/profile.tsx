import { Feather } from '@expo/vector-icons';
import { Image, View, TouchableOpacity, ImageBackground } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Toast from 'react-native-toast-message';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import { RegisterENS } from '~/components/Profile/RegisterENS';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { copyToClipboard } from '~/utils/helpers/copyToClipboard';
import { trimAddress } from '~/utils/helpers/strings/trimAddress';
import { toastConfig } from '~/utils/toastConfig';

const Profile = () => {
  const { privy, user } = useAppData();
  const truncatedAddress = trimAddress(privy.wallet?.account?.address || '', 6);

  const hasENS = !!user.ens;
  const ensName = hasENS ? `@${user.ens}` : 'Register your ENS!';
  const ensDomain = hasENS ? `${user.ens}.fdmntl.eth` : null;

  return (
    <Frame>
      <DetailsHeader title="Profile" />
      <View className="flex-1 items-center justify-center">
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <ImageBackground
            source={require('../../assets/fundamental-gradient.png')}
            className="overflow-hidden rounded-[15px] p-3">
            <Container className="rounded-lg bg-content px-2">
              <View className="gap-5">
                {hasENS ? (
                  <View className="gap-1">
                    <FText className="!text-3xl" bold>
                      {ensName}
                    </FText>
                    <TouchableOpacity onPress={() => copyToClipboard(ensDomain!)}>
                      <View className="flex flex-row items-center gap-2">
                        <FText italic>{ensDomain}</FText>
                        <Feather name="copy" size={14} className="text-text" />
                      </View>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <RegisterENS />
                )}

                <View className="items-center justify-center self-center rounded-xl bg-white p-3">
                  <QRCode value={user.wallet_address} size={200} />
                </View>

                <TouchableOpacity
                  onPress={() => copyToClipboard(user.wallet_address)}
                  className="w-auto flex-row items-center justify-center gap-2">
                  <FText className="!text-2xl !text-neutral">{truncatedAddress}</FText>
                  <Feather name="copy" size={18} className="text-text" />
                </TouchableOpacity>

                <View className="flex items-center justify-center">
                  <Image
                    source={require('../../assets/fundamental-text.png')}
                    style={{ width: 125, height: 22 }}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </Container>
          </ImageBackground>
        </View>
      </View>
      <Toast topOffset={55} config={toastConfig} />
    </Frame>
  );
};

export default Profile;
