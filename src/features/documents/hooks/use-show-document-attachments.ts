import { useDialogs } from '@/hooks/use-dialogs'
import { DocumentAttachmentsSheet } from '../components/document-attachments-sheet'

export function useShowDocumentAttachments() {
  const dialogs = useDialogs()

  const showAttachments = (documentId: number) => {
    dialogs.sheet(DocumentAttachmentsSheet, { documentId })
  }

  return {
    showAttachments,
  }
}
