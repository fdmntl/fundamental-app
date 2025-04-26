import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';
import { FText } from '../Text/FText';

import { sendFeedback } from '~/services/sendFeedback';
import { FeedbackType, ScreenName } from '~/types/feedbacks';

interface SendFeedbackButtonProps {
  userId: string;
}

export const SendFeedbackButton = ({ userId }: SendFeedbackButtonProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(FeedbackType.Other);
  const [screenName, setScreenName] = useState<ScreenName>(ScreenName.Other);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //   const feedbackTypes = Object.values(FeedbackType);
  //   const screenNames = Object.values(ScreenName);

  const handleSubmit = async () => {
    if (!feedbackText.trim()) return;

    try {
      await sendFeedback({
        userId,
        screen: screenName,
        type: feedbackType,
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

  return (
    <>
      <View className="absolute bottom-[7.5rem] right-6">
        <TouchableOpacity onPress={toggleModal} className="rounded-3xl bg-gray-800 p-4 opacity-80">
          <Feather name="message-circle" size={28} color="#8435E0" />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View className="flex-1 items-center justify-center bg-black/50">
            <View className="w-11/12 rounded-lg bg-white p-6">
              <FText className="mb-4 text-2xl font-bold !text-black" bold>
                Give us feedback on your experience!
              </FText>

              {/* TODO: Add a dropdown or picker for selecting feedback type */}

              {/* Feedback Text Input */}
              <TextInput
                placeholder="Describe your feedback..."
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
                className="mb-4 h-32 rounded border p-3"
              />

              {/* Buttons */}
              <View className="flex-row justify-between">
                <Button title="Cancel" onPress={toggleModal} />
                <Button title="Submit" onPress={handleSubmit} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};
