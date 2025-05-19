import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';
import { FText } from '../Text/FText';

import { sendFeedback } from '~/services/sendFeedback';
import { FeedbackType, ScreenName, FeedbackTypeLabels, ScreenNameLabels } from '~/types/feedbacks';

export const SendFeedbackButton = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>();
  const [screenName, setScreenName] = useState<ScreenName>();

  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [screenModalOpen, setScreenModalOpen] = useState(false);

  const toggleModal = () => {
    setTypeModalOpen(false);
    setScreenModalOpen(false);
    setFeedbackText('');
    setFeedbackType(undefined);
    setScreenName(undefined);
    setModalVisible(!isModalVisible);
  };

  const handleSubmit = async () => {
    if (!feedbackText.trim()) return;

    try {
      await sendFeedback({
        screen: screenName || ScreenName.Other,
        type: feedbackType || FeedbackType.Other,
        text: feedbackText.trim(),
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
      Toast.show({
        type: 'error',
        text1: 'Error sending feedback',
        text2: 'Please try again later.',
      });
    }

    setFeedbackText('');
    setFeedbackType(FeedbackType.Other);
    setScreenName(ScreenName.Other);
    toggleModal();

    Toast.show({
      type: 'success',
      text1: 'Feedback sent successfully!',
      text2: 'Thank you for your feedback.',
    });
  };

  const isDisabled = !feedbackText.trim() || !feedbackType || !screenName;

  return (
    <>
      <View className="absolute bottom-[7.5rem] right-6">
        <TouchableOpacity onPress={toggleModal} className="rounded-3xl bg-gray-800 p-4 opacity-80">
          <Feather name="message-circle" size={28} color="#8435E0" />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="w-11/12 gap-4 rounded-xl bg-white p-6">
            <FText className=" text-2xl font-bold !text-black" bold>
              Give us feedback on your experience!
            </FText>

            <View className={`${Platform.OS === 'ios' && 'z-50'} gap-2`}>
              <FText className="text-lg font-bold !text-black">Feedback Type</FText>
              <DropDownPicker
                open={typeModalOpen}
                setOpen={setTypeModalOpen}
                items={Object.values(FeedbackType).map((type) => ({
                  label: FeedbackTypeLabels[type],
                  value: type,
                }))}
                value={feedbackType || null}
                setValue={setFeedbackType}
                placeholder="Select feedback type"
                zIndex={2000}
                zIndexInverse={1000}
              />
            </View>

            <View className={`${Platform.OS === 'ios' && 'z-40'} gap-2`}>
              <FText className="text-lg font-bold !text-black">Screen Name</FText>
              <DropDownPicker
                open={screenModalOpen}
                setOpen={setScreenModalOpen}
                items={Object.values(ScreenName).map((name) => ({
                  label: ScreenNameLabels[name],
                  value: name,
                }))}
                value={screenName || null}
                setValue={setScreenName}
                placeholder="Select screen name"
                zIndex={1000}
                zIndexInverse={2000}
              />
            </View>

            {/* Feedback Text Input */}
            <View className="gap-2">
              <FText className="text-lg font-bold !text-black">Your Feedback</FText>
              <TextInput
                placeholder="Describe your feedback..."
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                className="mb-4 h-32 rounded-lg border p-3"
              />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity onPress={toggleModal}>
                <FText className="p-4 text-lg font-bold !text-black">Cancel</FText>
              </TouchableOpacity>
              <Button title="Submit" onPress={handleSubmit} disabled={isDisabled} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
