import React, {type PropsWithChildren, memo} from 'react';
import {Pressable} from 'react-native';

import {COLORS} from '../../constants';
import styles from './styles';

interface StyledButtonProps {
  customStyles?: object;
  disabled?: boolean;
  onPress: () => unknown;
}

function StyledButton(
  props: PropsWithChildren<StyledButtonProps>,
): JSX.Element {
  const {children, customStyles, disabled, onPress} = props;

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={{
        ...styles.button,
        ...(customStyles || {}),
        backgroundColor: disabled ? COLORS.muted : COLORS.accent,
      }}>
      {children}
    </Pressable>
  );
}

export default memo(StyledButton);
