import { useCallback, useRef, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { FileUp } from 'lucide-react'
import { toast } from 'sonner'
import { attachmentKeysFactory } from '@/api/query-key-factory'
import { ACCEPTED_FILE_TYPES } from '@/constants/file'
import { Button } from '@/components/ui/button'
import { FileUpload, FileUploadTrigger } from '@/components/ui/file-upload'
import { Progress } from '@/components/ui/progress'
import { useUploadAttachments } from '../hooks/use-upload-attachments'
import { fileSchema } from '../schema'

export function AddFilesAction() {
  const uploadAttachments = useUploadAttachments()
  const abortControllerRef = useRef<AbortController | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
    }
  }, [])

  const onFileValidate = useCallback((file: File) => {
    const result = fileSchema.safeParse(file)
    if (result.success) return null
    return result.error.issues[0]?.message || 'Invalid file'
  }, [])

  const onFileAccept = useCallback(
    async (file: File) => {
      const fileName =
        file.name.length > 30 ? `${file.name.slice(0, 30)}...` : file.name

      abortControllerRef.current = new AbortController()

      const cancelUpload = () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
          abortControllerRef.current = null
        }
        toast.error(`Upload cancelled: ${fileName}`, {
          description: 'Upload was cancelled by user',
        })
      }

      const toastId = toast.loading(`Uploading ${fileName}`, {
        action: {
          label: 'Cancel',
          onClick: cancelUpload,
        },
      })

      try {
        await uploadAttachments([file], {
          abortController: abortControllerRef.current,
          onProgress: (progressFile, progress) => {
            if (progressFile.name === file.name) {
              toast.loading(`Uploading ${fileName}`, {
                id: toastId,
                description: <Progress value={progress} className='h-2' />,
                action: {
                  label: 'Cancel',
                  onClick: cancelUpload,
                },
              })
            }
          },
          onSuccess: (successFile) => {
            if (successFile.name === file.name) {
              toast.success('Upload successful', {
                id: toastId,
                action: null,
                description: fileName,
                cancel: {
                  label: 'Dismiss',
                  onClick: () => toast.dismiss(toastId),
                },
                duration: Infinity,
              })
              abortControllerRef.current = null
            }
          },
          onError: (errorFile, error) => {
            if (errorFile.name === file.name) {
              const isAbortError = error.name === 'AbortError'

              const errorMessage = isAbortError
                ? 'Upload cancelled'
                : error.message ||
                  'Something went wrong during the upload process.'

              toast.error(
                isAbortError
                  ? `Upload cancelled: ${fileName}`
                  : `Failed to upload ${fileName}`,
                {
                  id: toastId,
                  description: errorMessage,
                }
              )
              abortControllerRef.current = null
            }
          },
        })

        await queryClient.invalidateQueries({
          queryKey: attachmentKeysFactory.myAttachments(),
        })
      } catch (error) {
        const isAbortError =
          error instanceof Error && error.name === 'AbortError'

        const errorMessage = isAbortError
          ? 'Upload cancelled'
          : error instanceof Error
            ? error.message
            : 'An unexpected error occurred during upload.'

        toast.error(
          isAbortError
            ? `Upload cancelled: ${fileName}`
            : `Failed to upload ${fileName}`,
          {
            id: toastId,
            description: errorMessage,
          }
        )
        abortControllerRef.current = null
      }
    },
    [uploadAttachments, queryClient]
  )

  const onFileReject = useCallback((file: File, message: string) => {
    const fileName =
      file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
    toast.error(`File rejected: ${fileName}`, {
      description: `${message}`,
    })
  }, [])

  return (
    <>
      <FileUpload
        onFileValidate={onFileValidate}
        onFileAccept={onFileAccept}
        onFileReject={onFileReject}
        accept={ACCEPTED_FILE_TYPES.join(',')}
        className='w-full max-w-md'
        multiple
      >
        <FileUploadTrigger asChild>
          <Button>
            <FileUp className='mr-2 h-4 w-4' />
            Files upload
          </Button>
        </FileUploadTrigger>
      </FileUpload>
    </>
  )
}
