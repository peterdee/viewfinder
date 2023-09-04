/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  // StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [server, setServer] = useState<TcpSocket.Server>();

  const handleCreateServer = useCallback((): null | void => {
    if (server) {
      return null;
    }
    const TCPServer = TcpSocket.createServer(socket => {
      socket.on('data', data => {
        socket.write('Echo server ' + data);
      });

      socket.on('error', error => {
        console.log('An error ocurred with client socket ', error);
      });

      socket.on('close', error => {
        console.log('Closed connection with ', socket.address(), error);
      });
    }).listen({
      port: 3030,
      host: '127.0.0.1',
    });

    TCPServer.on('error', error => {
      console.log('An error ocurred with the server', error);
    });

    TCPServer.on('listening', (): void => {
      console.log('running server');
      setServer(server);
    });
    TCPServer.on('close', () => {
      console.log('Server closed connection');
    });
  }, [server]);

  const handleCreateClient = useCallback((): null | void => {
    const options = {
      port: 3030,
      host: '127.0.0.1',
      localAddress: '127.0.0.1',
      reuseAddress: true,
      // localPort: 20000,
      // interface: "wifi",
    };

    // Create socket
    const client = TcpSocket.createConnection(options, () => {
      // Write on the socket
      client.write('Hello server!');

      // Close socket
      // client.destroy();
    });

    client.on('data', data => {
      console.log('message was received', data);
    });

    client.on('error', error => {
      console.log(error);
    });

    client.on('close', () => {
      console.log('Connection closed!');
    });
  }, []);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Pressable onPress={handleCreateServer}>
            <Text>Create server</Text>
          </Pressable>
          <Pressable onPress={handleCreateClient}>
            <Text>Create client</Text>
          </Pressable>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>Content</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
