// styling
import { Text, TouchableOpacity, View } from 'react-native';

// utils
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

// auth
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';

// relative imports
import NLWLogo from '../src/assets/nlw-logo.svg';
import { api } from '../src/assets/lib/api';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/2d0be6ec2dae822b0b87',
};

export default function App() {
  const router = useRouter();

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '2d0be6ec2dae822b0b87',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery
  );

  async function handleGithubOauthCode(code: string) {
    const response = await api.post('/register', {
      code,
    });

    const { userJwt } = response.data;
    await SecureStore.setItemAsync('token', userJwt);

    router.push('/memories');
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      handleGithubOauthCode(code).catch((err) => {
        console.log(err);
      });
    }
  }, [response]);

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="text-center font-alt text-sm uppercase text-black">
            cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  );
}
