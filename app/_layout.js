import React from 'react';
import { Provider } from 'react-redux';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../redux/store';
import { StatusBar } from 'expo-status-bar';
import { AlertProvider } from '../context/AlertContext';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AlertProvider>
        <SafeAreaProvider>
          <StatusBar hidden={true} />
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaProvider>
      </AlertProvider>
    </Provider>
  );
}
