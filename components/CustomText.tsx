// components/CustomText.tsx
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

export default function CustomText(props: TextProps) {
  return (
    <Text
      {...props}
      style={[{ fontFamily: 'SpaceMono', }, props.style]}
    />
  );
}
