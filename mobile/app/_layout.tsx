// styling
import { styled } from 'nativewind';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

// relative imports
import blurBG from '../src/assets/bg-blur.png';
import Stripes from '../src/assets/stripes.svg';

// fonts
import { useFonts } from 'expo-font';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { SplashScreen, Stack } from 'expo-router';

// now it is possible to use tialwind styling on the svg
const StyledStripes = styled(Stripes);
export default function Layout() {
  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

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
      />
    </ImageBackground>
  );
}
