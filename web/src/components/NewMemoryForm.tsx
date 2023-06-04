'use client'
import { Camera } from 'lucide-react'
import { MediaPicker } from './MediaPicker'
import { FormEvent } from 'react'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from 'next/navigation'

export function NewMemoryForm() {
  const router = useRouter()

  const handleCreateMemory = async function (
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    // process the file upload
    const formData = new FormData(event.currentTarget)
    const fileToUpload = formData.get('coverUrl')
    let coverUrl = ''
    if (fileToUpload) {
      const uploadFormData = new FormData()
      uploadFormData.set('file', fileToUpload)

      const uploadResponse = await api.post('/upload', uploadFormData)
      coverUrl = uploadResponse.data.url
      console.log(coverUrl)
    }

    // send the memory
    const token = Cookie.get('token')
    await api.post(
      '/memories',
      {
        coverUrl,
        content: formData.get('content'),
        isPublic: formData.get('isPublic'),
      },
      {
        // some functions as cookies from next/headers cannot be used inside 'use client modules', it is a BFF thing
        // So, we need to take the coolie from the global document object
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    // redirect to the main pagge
    router.push('/')
  }
  return (
    <form onSubmit={handleCreateMemory} className="flex flex-1 flex-col gap-2">
      <div className="flex items-center gap-4">
        {/* Small hack to hide the horrible imput file element, by redirecting its funcionality to the label while keeping the element itself invisible */}
        <label
          htmlFor="media"
          className="iems-center text-grey-200 hover:text-grey-100 flex cursor-pointer gap-1.5 text-sm"
        >
          <Camera className="h-4 w-4" />
          Anexar mídia
        </label>
        <label
          htmlFor="isPublic"
          className="text-grey-200 hover:text-grey-100 flex items-center gap-1.5 text-sm"
        >
          <input
            type="checkbox"
            name="isPublic"
            id="isPublic"
            value="true"
            className="h-4 w-4 rounded border-gray-400 bg-gray-700 text-purple-500"
          />
          Tornar memória pública
        </label>
      </div>
      <MediaPicker />
      <textarea
        name="content"
        spellCheck={false}
        className="w-full flex-1 resize-none rounded border-0 bg-transparent p-0 text-lg leading-relaxed text-gray-100 placeholder:text-gray-400 focus:ring-0"
        placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
      />
      <button
        type="submit"
        className="inline-block self-end rounded-full bg-green-500 px-5 py-3 font-alt text-sm uppercase leading-none text-black hover:bg-green-600"
      >
        Salvar
      </button>
    </form>
  )
}
