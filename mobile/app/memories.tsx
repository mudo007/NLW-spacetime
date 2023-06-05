import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Icon from '@expo/vector-icons/Feather';
import NLWLogo from '../src/assets/nlw-logo.svg';
import { ScrollView, TouchableOpacity, View, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../src/assets/lib/api';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

// memory object model
interface Memory {
  converUrl: string
  excerpt: string
  createdAt: string
  id: string
}

export default function Memories() {
  dayjs.locale(ptBr)
  const { bottom, top } = useSafeAreaInsets();
  const router = useRouter();
  const [memories, setMemories] = useState<Memory[]>([])
  const signOut = async function () {
    await SecureStore.deleteItemAsync('token');

    router.push('/');
  };

  // load the memories upon screen load
  const loadMemories = async function () {
    const token = await SecureStore.getItemAsync('token');
    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setMemories(response.data)
  };

  useEffect(() => {
    loadMemories();
  }, []);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />
        <View className="flex-row gap-2">
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#FFF" />
            </TouchableOpacity>
          </Link>
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => { 
          return (
            <View key={memory.id} className="space-4-y">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="h-px w-5 bg-gray-50" />

                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY")}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{ uri: memory.converUrl }}
                  className="aspect-video w-full rounded-lg"
                  alt="gravata borboleta azul"
                ></Image>
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href={`/memories/${memory.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          )
        })}

      </View>
    </ScrollView>
  );
}
