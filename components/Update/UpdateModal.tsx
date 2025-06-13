import React from 'react';
import { Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface UpdateModalProps {
  visible: boolean;
  versionName: string;
  updateUrl: string;
  currentVersionName: string;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  versionName,
  updateUrl,
  currentVersionName,
  onClose,
}) => {
  const handleUpdate = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl);
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Update Available</Text>
          <Text style={styles.modalBody}>
            A new version ({currentVersionName} → {versionName}) of the app is available! Please
            update to get the latest features.
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
              <Text style={styles.textStyle}>Later</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.buttonUpdate]} onPress={handleUpdate}>
              <Text style={styles.textStyle}>Update Now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#18141F',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonUpdate: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#555',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  modalBody: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'white',
  },
});
