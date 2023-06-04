import {
  View,
  TouchableOpacity,
  Switch,
  Text,
  TextInput,
  Image,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import NLWLogo from '../src/assets/nlw-logo.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import * as MimeTypes from 'react-native-mime-types';
import { api } from '../src/assets/lib/api';

export default function NewMemory() {
  const router = useRouter()

  // gives the safe areas to insert the component
  const { bottom, top } = useSafeAreaInsets();
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const openImagePicker = async function () {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (result.assets[0]) {
        setPreview(result.assets[0].uri);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleCreateMemory = async function () {

    // retrives the bearer token
    const token = await SecureStore.getItemAsync('token');

    if (!token){
      return
    }
    // if there is an image, upload it first
    let coverUrl = '';
    const fileExtension = preview.slice(preview.lastIndexOf('.') + 1);
    const fileName = `image.${fileExtension}`;
    const fileMimeType = MimeTypes.lookup(fileExtension);

    if (preview){
      const uploadFormData = new FormData()
      uploadFormData.append('file', {
        uri: preview,
        name: fileName,
        type: fileMimeType,
        // workaround for typescript
      } as any)
      const uploadResponse = await api.post('/upload', uploadFormData, {
        // for Android, the header content-type must be explicity added
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      coverUrl = uploadResponse.data.url
    }

    // create the memory
    await api.post('/memories', {
      content,
      coverUrl,
      isPublic,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // redirect to the memories page
    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            {' '}
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              alt=""
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#fff" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          multiline
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos, e relatos sobre essa
        experiência que você que lembrar para sempre."
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
