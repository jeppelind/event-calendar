/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Text, TextProps } from 'react-native';

// eslint-disable-next-line import/prefer-default-export
export const MyAppText: React.FC<TextProps> = (props) => {
  const { children, style } = props;
  return (
    <Text {...props} style={[{ fontFamily: 'Poppins_400Regular', ...(style as Object) }]}>
      {children}
    </Text>
  );
};
