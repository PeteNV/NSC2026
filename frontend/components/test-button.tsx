// components/M3Button.tsx
import React from 'react';
import { Button } from 'react-native-paper';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

export function M3Button({ title, onPress, disabled = false }: Props) {
  return (
    <Button 
      mode="contained" // Material 3 Filled button style
      onPress={onPress} 
      disabled={disabled}
    >
      {title}
    </Button>
  );
}
