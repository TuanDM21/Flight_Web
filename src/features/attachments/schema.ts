import { z } from 'zod'
import { formatFileSize } from '@/lib/format'
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from '@/constants/file'

export const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    (file) => ({
      message: `Tệp "${file.name}" quá lớn. Kích thước tối đa là ${formatFileSize(MAX_FILE_SIZE)}.`,
    })
  )
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    (file) => ({
      message: `Tệp "${file.name}" có định dạng không được hỗ trợ. Các định dạng được phép: ${ACCEPTED_FILE_TYPES.join(', ')}`,
    })
  )
