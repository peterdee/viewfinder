import React, {memo, useCallback, useRef, useState} from 'react';
import {
  Camera,
  type CameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
import {StyleSheet, Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import {clientLog} from '../../utilities/logger';
import type {ClientProps} from '../../types/navigation';
import {CONNECTION, SPACER} from '../../constants';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Client({navigation}: ClientProps): JSX.Element {
  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [client, setClient] = useState<TcpSocket.Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const cameraDevice = useCameraDevices().back || null;
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

    console.log('before client', client);
    if (!client) {
      setLoading(true);
      const options = {
        host: '192.168.43.1',
        // host: '127.0.0.1',
        // localAddress: '192.168.43.1',
        // localAddress: '127.0.0.1',
        port: CONNECTION.port,
        // reuseAddress: true,
        // localPort: 20000,
        // interface: 'wifi' as ConnectionInterface,
      };

      // Create socket
      const TCPClient = TcpSocket.createConnection(options, () => {
        // Write on the socket
        clientLog('client is running');
        TCPClient.write('Hello server!');
        clientLog(TCPClient.readyState);
        TCPClient.emit('data', 'hello server');

        TCPClient.on('data', (data: string | Buffer) => {
          clientLog('received', data.toString());
        });
        // Close socket
        // client.destroy();
        TCPClient.on('connect', () => clientLog('connected'));
        TCPClient.on('error', e => clientLog('err', e));
        setClient(TCPClient);
        setConnected(true);
        setLoading(false);
      });
      TCPClient.on('error', e => clientLog(e));
    }
  }, [client]);

  const handleStopClient = useCallback((): void => {
    if (connected && client) {
      client.destroy();
      setClient(null);
      setConnected(false);
    }
  }, [client, connected]);

  return (
    <View style={styles.wrap}>
      {cameraPermission && cameraDevice && (
        <Camera
          device={cameraDevice as CameraDevice}
          isActive
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          video
        />
      )}
      {connected && (
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
