import { DocumentAttachment } from '../../documents/types'
import { useConfirmUploadAttachments } from './use-confirm-upload-attachments'
import { useGenerateUploadUrls } from './use-generate-upload-urls'

interface UploadOptions {
  onProgress: (file: File, progress: number) => void
  onSuccess: (file: File) => void
  onError: (file: File, error: Error) => void
  abortController?: AbortController
}

export const useUploadAttachments = () => {
  const generateUploadUrls = useGenerateUploadUrls()
  const confirmUpload = useConfirmUploadAttachments()

  return async (files: File[], options: UploadOptions) => {
    files.forEach((file) => options.onProgress(file, 10))
    const uploadRequest = {
      files: files.map((file) => ({
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
      })),
    }

    const presignUrlsMutation = await generateUploadUrls.mutateAsync({
      body: uploadRequest,
      signal: options.abortController?.signal,
    })

    const uploadUrls = presignUrlsMutation.data!
    files.forEach((file) => options.onProgress(file, 20))
    try {
      const uploadPromises = files.map(async (file) => {
        const fileInfo = uploadUrls.files.find((f) => f.fileName === file.name)
        if (!fileInfo) {
          throw new Error(`No upload URL for file: ${file.name}`)
        }

        const response = await fetch(fileInfo.uploadUrl!, {
          method: 'PUT',
          headers: {
            'x-ms-blob-type': 'BlockBlob',
            'Content-Type': file.type,
          },
          body: file,
          signal: options.abortController?.signal,
        })

        if (!response.ok) {
          throw new Error(
            `Không thể tải lên ${file.name}: ${response.statusText}`
          )
        }

        options.onProgress(file, 80)
        return {
          file,
          attachmentId: fileInfo.attachmentId,
        }
      })

      const uploadResults = await Promise.allSettled(uploadPromises)
      const successfulUploads = uploadResults
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value)
      const failedUploads = uploadResults.filter(
        (result) => result.status === 'rejected'
      )

      if (failedUploads.length > 0) {
        failedUploads.forEach((result) => {
          const failedIndex = uploadResults.findIndex((r) => r === result)
          const file = files[failedIndex]
          if (file) {
            const error = result.reason as Error
            options.onError(file, error)
          }
        })
      }

      if (successfulUploads.length > 0) {
        successfulUploads.forEach((result) => {
          options.onProgress(result.file, 90)
        })

        const attachmentIds = successfulUploads.map((result) =>
          Number(result.attachmentId)
        )

        const confirmedAttachments = await confirmUpload.mutateAsync({
          body: {
            attachmentIds,
          },
          signal: options.abortController?.signal,
        })

        successfulUploads.forEach((result) => {
          options.onProgress(result.file, 100)
          options.onSuccess(result.file)
        })

        return {
          success: true,
          attachmentIds: attachmentIds,
          confirmedAttachments:
            confirmedAttachments.data! as Required<DocumentAttachment>[],
        }
      }
    } catch (error) {
      // Handle AbortError specifically
      if (error instanceof Error && error.name === 'AbortError') {
        files.forEach((file) => {
          options.onError(file, error)
        })
        return {
          success: false,
          error: error,
          confirmedAttachments: [],
        }
      }

      files.forEach((file) => {
        options.onError(file, error as Error)
      })
      return {
        success: false,
        error: error as Error,
        confirmedAttachments: [],
      }
    }

    return {
      success: false,
      error: new Error('Không có file nào được tải lên thành công'),
      confirmedAttachments: [],
    }
  }
}
