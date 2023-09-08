import React, {memo, useCallback, useState} from 'react';
import {Text, View} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import {CONNECTION, SPACER} from '../../constants';
import {serverLog} from '../../utilities/logger';
import type {ServerProps} from '../../types/navigation';
import StyledButton from '../../components/StyledButton';
import styles from './styles';

function Server({navigation}: ServerProps): JSX.Element {
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [server, setServer] = useState<TcpSocket.Server>();

  const handleCreateServer = useCallback((): null | void => {
    if (connected) {
      return null;
    }

    setLoading(true);

    const TCPServer = TcpSocket.createServer(socket => {
      // handlers
      socket.on('data', data => {
        serverLog('incoming', data.toString());
        socket.write('Echo server ' + data);
      });
      socket.emit('data', 'response');

      socket.on('error', error => {
        serverLog('An error ocurred with client socket ', error);
      });

      socket.on('close', error => {
        serverLog('Closed connection with ', socket.address(), error);
      });
    }).listen({
      host: CONNECTION.serverHost,
      port: CONNECTION.port,
    });

    TCPServer.on('listening', (): void => {
      serverLog(
        'started server on',
        CONNECTION.serverHost,
        ':',
        CONNECTION.port,
      );
      setConnected(true);
      setServer(TCPServer);
      setLoading(false);
    });

    TCPServer.on('error', error => {
      serverLog('An error ocurred with the server:', error, CONNECTION);
    });

    TCPServer.on('close', () => {
      serverLog('Server closed connection');
    });
  }, [connected]);

  const handleStopServer = useCallback((): void => {
    if (connected && server) {
      setLoading(true);
      server.close((): void => {
        setConnected(false);
        setLoading(false);
      });
    }
  }, [connected, server]);

  return (
    <View style={styles.wrap}>
      {connected && (
        <StyledButton disabled={loading} onPress={handleStopServer}>
          <Text style={styles.buttonText}>Stop server</Text>
        </StyledButton>
      )}
      {!connected && (
        <StyledButton disabled={loading} onPress={handleCreateServer}>
          <Text style={styles.buttonText}>Start server</Text>
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

export default memo(Server);
