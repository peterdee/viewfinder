import React, {memo, useEffect, useState} from 'react';
import {
  Camera,
  type CameraPermissionRequestResult,
  useCameraDevices,
  useFrameProcessor,
  Frame,
} from 'react-native-vision-camera';
import {StyleSheet, Text, View} from 'react-native';

import type {CameraTestProps} from '../../types/navigation';
import {SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function CameraTest({navigation}: CameraTestProps): JSX.Element {
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [permissionError, setPermissionError] = useState<boolean>(false);

  const cameraDevice = useCameraDevices().back || null;

  const frameProcessor = useFrameProcessor((frame: Frame): void => {
    'worklet';
    console.log('got frame', frame, 123);
  }, []);

  useEffect((): void => {
    Camera.requestCameraPermission()
      .then((result: CameraPermissionRequestResult): void => {
        if (result === 'granted') {
          setCameraPermission(true);
        }
      })
      .catch((): void => {
        setPermissionError(true);
      })
      .finally((): void => {
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.wrap}>
      {loading && <Text>Loading</Text>}
      {!loading && (
        <>
          {permissionError && <Text>Could not access the camera!</Text>}
          {!permissionError && cameraPermission && (
            <>
              {!cameraDevice && <Text>Could not find a camera!</Text>}
              {cameraDevice && (
                <Camera
                  device={cameraDevice}
                  frameProcessor={frameProcessor}
                  isActive
                  style={StyleSheet.absoluteFill}
                />
              )}
            </>
          )}
        </>
      )}
      <StyledButton
        customStyles={{marginTop: SPACER}}
        onPress={(): void => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Back</Text>
      </StyledButton>
    </View>
  );
}

export default memo(CameraTest);
