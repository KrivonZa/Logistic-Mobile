import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { MaterialIcons } from "@expo/vector-icons";

interface ImageModalViewerProps {
  visible: boolean;
  images: { url: string }[];
  onClose: () => void;
}

const ImageModalViewer: React.FC<ImageModalViewerProps> = ({
  visible,
  images,
  onClose,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <ImageViewer
        imageUrls={images}
        enableSwipeDown
        onSwipeDown={onClose}
        onCancel={onClose}
        renderIndicator={(currentIndex?: number, totalLength?: number) => {
          if (!currentIndex || !totalLength) return <View />;
          return (
            <View className="absolute top-10 w-full items-center">
              <Text className="text-white text-lg font-semibold">
                {`${currentIndex} / ${totalLength}`}
              </Text>
            </View>
          );
        }}
        renderHeader={() => (
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-10 right-5 z-10 p-2 rounded-full bg-black/50"
          >
            <MaterialIcons name="close" size={28} color="white" />
          </TouchableOpacity>
        )}
      />
    </Modal>
  );
};

export default ImageModalViewer;
