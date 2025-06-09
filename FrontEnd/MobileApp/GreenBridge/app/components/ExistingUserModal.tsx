import React from 'react';
import { Modal, View, Text, Button, StyleSheet, TouchableWithoutFeedback } from 'react-native';

type UserExistsModalProps = {
    visible: boolean;
    onClose: () => void;
    message: string; // <-- accept custom message
};

const UserExistsModal: React.FC<UserExistsModalProps> = ({ visible, onClose, message }) => {
    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Notification</Text>
                        <Text style={styles.message}>{message}</Text>
                        <Button title="Close" onPress={onClose} color="#ff4444" />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 30,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 25,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#ff4444',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
});

export default UserExistsModal;
