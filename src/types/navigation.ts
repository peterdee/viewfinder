import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type StackParamList = {
  CameraTest: undefined;
  Client: undefined;
  Main: undefined;
  Server: undefined;
};

export type CameraTestProps = NativeStackScreenProps<
  StackParamList,
  'CameraTest'
>;

export type ClientProps = NativeStackScreenProps<StackParamList, 'Client'>;

export type MainProps = NativeStackScreenProps<StackParamList, 'Main'>;

export type ServerProps = NativeStackScreenProps<StackParamList, 'Server'>;
