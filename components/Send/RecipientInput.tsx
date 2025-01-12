import React from 'react';
import { View, TextInput } from 'react-native';
import { isAddress } from 'viem';

import { FText } from '~/components/Text/FText';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RecipientInput = ({ value, onChange }: RecipientInputProps) => {
  // const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  // const [ensName, setEnsName] = useState<string | null>(null);

  const isValidAddress = isAddress(value);

  //* Keep this for further use
  // const getEnsNameAndAvatar = async () => {
  //   const ensName = await client.getEnsName({ address: recipientAddress as `0x${string}` });
  //   if (ensName) {
  //     console.log('ENS Name:', ensName);
  //     setEnsName(ensName);
  //     const ensAvatar = await client.getEnsAvatar({ name: normalize(ensName) });
  //     setEnsAvatar(ensAvatar);
  //     console.log('ENS Avatar:', ensAvatar);
  //   } else {
  //     console.log('ENS Name not found.');
  //   }
  // };

  const handleInputChange = (value: string) => {
    onChange(value);
  };

  return (
    <View className="h-fit w-full gap-4 rounded-xl bg-content p-6">
      <View className="flex-row items-center">
        <FText className="!text-2xl" bold>
          Recipient
        </FText>
      </View>
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 rounded-md bg-content text-4xl font-semibold
            ${value === '' ? 'text-text' : isValidAddress ? 'text-success' : 'text-error'}`}
          placeholder="0x1234...abcd"
          placeholderTextColor="#888"
          value={value}
          onChangeText={(text) => {
            handleInputChange(text);
          }}
        />
        {/* {ensAvatar && (
          <View className="ml-4 items-center">
            <Image
              source={{
                uri: ensAvatar,
              }}
              className="h-16 w-16 rounded-full"
            />
            {ensName && <FText className="font-semibold text-text">{ensName}</FText>}
          </View>
        )} */}
      </View>
    </View>
  );
};

export default RecipientInput;

// Vitalik's ETH address: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
