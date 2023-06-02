// styling
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { ImageBackground } from 'react-native';

// relative imports
import blurBG from '../src/assets/bg-blur.png';
import Stripes from '../src/assets/stripes.svg';

// fonts
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

// now it is possible to use tialwind styling on the svg
const StyledStripes = styled(Stripes);
export default function Layout() {
  // useState retutns an array with a variable and the function that
  // must be used to alter that variable so that the changes are propagated
  // it takes a generic with the possible types and a starting value
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null);

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  // hook without watching any variable, it executes only once on the
  // component loading
  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) =>
      // little hack to turn the string into a boolean
      {
        setIsUserAuthenticated(!!token);
      }
    );
  }, []);

  if (!hasLoadedFonts) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      source={blurBG}
      className="relative flex-1 bg-gray-900"
      imageStyle={{ position: 'absolute', left: '-100%' }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {/* redirect automatically from index to memories in case the user is authenticated */}
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="new" />
        <Stack.Screen name="memories" />
      </Stack>
    </ImageBackground>
  );
}
