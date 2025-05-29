import { DocumentAttachment } from '@/features/documents/types'

export async function convertToFile(obj: DocumentAttachment): Promise<File> {
  if (!obj.filePath || !obj.fileName || !obj.createdAt) {
    throw new Error('Invalid DocumentAttachment object')
  }

  const response = await fetch(obj.filePath)
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`)
  }

  const blob = await response.blob()

  const file = new File([blob], obj.fileName, {
    type: blob.type || 'application/octet-stream',
    lastModified: new Date(obj.createdAt).getTime(),
  })

  return file
}

export function downloadFileFromUrl({
  url,
  filename,
}: {
  url: string
  filename?: string
}): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const a = document.createElement('a')
      a.href = url
      if (filename) a.download = filename

      document.body.appendChild(a)

      a.click()

      document.body.removeChild(a)
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}
