import React, {memo, useCallback, useRef, useState} from 'react';
import {
  Camera,
  type CameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import {StyleSheet, Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import type {ClientProps} from '../../types/navigation';
import {CONNECTION, SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Client({navigation}: ClientProps): JSX.Element {
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [client, setClient] = useState<TcpSocket.Socket>();
  const [loading, setLoading] = useState<boolean>(false);

  const cameraDevice = useCameraDevices().back;
  const cameraRef = useRef<Camera | null>(null);

  const handleCreateClient = useCallback(async (): Promise<null | void> => {
    try {
      const permission = await Camera.requestCameraPermission();
      if (permission === 'granted') {
        setCameraPermission(true);
      } else {
        return setCameraPermission(false);
      }
    } catch {
      return setCameraPermission(false);
    }

    if (!client) {
      setLoading(true);
      const options = {
        host: '127.0.0.1',
        localAddress: '127.0.0.1',
        port: CONNECTION.port,
        reuseAddress: true,
        // localPort: 20000,
        // interface: "wifi",
      };

      // Create socket
      const TCPClient = TcpSocket.createConnection(options, () => {
        // Write on the socket
        console.log('here');
        TCPClient.write('Hello server!');
        console.log(TCPClient.readyState);

        // Close socket
        // client.destroy();
        TCPClient.on('connect', () => console.log('connected'));
        TCPClient.on('error', e => console.log('err', e));
        setClient(TCPClient);
      });
    }
  }, [client]);

  const handleStopClient = useCallback((): void => {
    if (connected && client) {
      client.destroy();
      setConnected(false);
    }
  }, [client, connected]);

  return (
    <View style={styles.wrap}>
      {cameraPermission && (
        <Camera
          device={cameraDevice as CameraDevice}
          isActive
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          video
        />
      )}
      {cameraPermission && connected && (
        <StyledButton disabled={loading} onPress={handleStopClient}>
          <Text style={styles.buttonText}>Stop client</Text>
        </StyledButton>
      )}
      {!connected && (
        <StyledButton disabled={loading} onPress={handleCreateClient}>
          <Text style={styles.buttonText}>Start client</Text>
        </StyledButton>
      )}
      <StyledButton
        customStyles={{marginTop: SPACER}}
        onPress={(): void => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Back</Text>
      </StyledButton>
    </View>
  );
}

export default memo(Client);
