import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Camera,
  type CameraDevice,
  type CameraPermissionRequestResult,
  useCameraDevices,
  PhotoFile,
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
  const cameraRef = useRef<Camera | null>(null);

  const frameProcessor = useFrameProcessor((frame: Frame): void => {
    'worklet';
    console.log('got frame', frame);
  }, []);

  const handleCameraInitialization = useCallback((): void => {
    if (cameraRef && cameraRef.current) {
      const {current} = cameraRef;
      current
        .takePhoto({
          enableAutoStabilization: true,
          enableShutterSound: false,
          flash: 'off',
          qualityPrioritization: 'quality',
        })
        .then((photo: PhotoFile): void => console.log('photo taken', photo))
        .catch((error: Error): void => console.log('photo error', error));
    }
  }, [cameraRef]);

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
                  onInitialized={handleCameraInitialization}
                  photo
                  ref={cameraRef}
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
