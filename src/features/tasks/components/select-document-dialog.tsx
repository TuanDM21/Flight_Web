import { ColumnDef } from '@tanstack/react-table'
import { fa } from '@faker-js/faker'
import { ArrowUpDown, DollarSign, Eye, MoreHorizontal } from 'lucide-react'
import { useDataTable } from '@/hooks/use-data-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
// Removing unused import
import { DataTable } from '@/components/data-table/data-table'
import { DataTableAdvancedToolbar } from '@/components/data-table/data-table-advanced-toolbar'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { DataTableFilterMenu } from '@/components/data-table/data-table-filter-menu'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveDocuments: (documents: Document[]) => void
}

const data: Document[] = [
  {
    documentId: 1,
    documentType: 'brief',
    content: 'Tài liệu mô tả yêu cầu',
    notes: 'Ghi chú thêm nếu cần',
    attachments: [
      {
        filePath: '/uploads/specs.pdf',
        fileName: 'specs.pdf',
      },
      {
        filePath: '/uploads/requirements.docx',
        fileName: 'requirements.docx',
      },
      {
        filePath: '/uploads/timeline.xlsx',
        fileName: 'timeline.xlsx',
      },
    ],
  },
  {
    documentId: 2,
    documentType: 'report',
    content: 'Báo cáo kết quả kiểm thử',
    notes: 'Phiên bản 1.0',
    attachments: [
      {
        filePath: '/uploads/test-results.pdf',
        fileName: 'test-results.pdf',
      },
      {
        filePath: '/uploads/test-cases.xlsx',
        fileName: 'test-cases.xlsx',
      },
      {
        filePath: '/uploads/screenshots.zip',
        fileName: 'screenshots.zip',
      },
      {
        filePath: '/uploads/errors.log',
        fileName: 'errors.log',
      },
    ],
  },
  {
    documentId: 3,
    documentType: 'contract',
    content: 'Hợp đồng dịch vụ',
    notes: 'Đã được duyệt',
    attachments: [
      {
        filePath: '/uploads/contract.pdf',
        fileName: 'contract.pdf',
      },
      {
        filePath: '/uploads/terms.pdf',
        fileName: 'terms.pdf',
      },
    ],
  },
  {
    documentId: 4,
    documentType: 'presentation',
    content: 'Bài thuyết trình sản phẩm',
    notes: 'Cho buổi demo 15/5',
    attachments: [
      {
        filePath: '/uploads/presentation.pptx',
        fileName: 'presentation.pptx',
      },
      {
        filePath: '/uploads/demo-script.docx',
        fileName: 'demo-script.docx',
      },
      {
        filePath: '/uploads/product-images.zip',
        fileName: 'product-images.zip',
      },
      {
        filePath: '/uploads/market-data.xlsx',
        fileName: 'market-data.xlsx',
      },
      {
        filePath: '/uploads/competitor-analysis.pdf',
        fileName: 'competitor-analysis.pdf',
      },
    ],
  },
  {
    documentId: 5,
    documentType: 'plan',
    content: 'Kế hoạch triển khai',
    notes: 'Cập nhật ngày 10/5',
    attachments: [],
  },
]

export type Attachment = {
  filePath: string
  fileName: string
}

export type Document = {
  documentId: number
  documentType: string
  content: string
  notes: string
  attachments: Attachment[]
}

export const columns: ColumnDef<Document>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='px-4 py-2'>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
          }}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='px-4 py-2'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value)
          }}
          aria-label='Select row'
        />
      </div>
    ),
    size: 64,
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'sticky left-0 bg-background border-r',
    },
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Task ID' />
    ),
    cell: ({ cell }) => <div>#{cell.getValue<number>() ?? 'N/A'}</div>,
    meta: {
      className: '',
      label: 'id',
      placeholder: 'Search ID...',
      variant: 'text',
      icon: DollarSign,
    },
    enableColumnFilter: false,
  },
  {
    accessorKey: 'documentType',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Loại tài liệu' />
    },
    cell: ({ row }) => (
      <div className='capitalize'>{row.getValue('documentType')}</div>
    ),
  },
  {
    accessorKey: 'content',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Nội dung' />
    },
    cell: ({ row }) => <div>{row.getValue('content')}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'notes',
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title='Ghi chú' />
    },
    cell: ({ row }) => <div>{row.getValue('notes')}</div>,
    enableColumnFilter: false,
  },
  {
    accessorKey: 'attachments',
    header: () => <div>Tệp đính kèm</div>,
    cell: ({ row }) => {
      const attachments = row.getValue('attachments') as Attachment[]
      const totalFiles = attachments.length

      return (
        <div className='flex flex-wrap items-center gap-1'>
          {totalFiles > 0 ? (
            <>
              {attachments.slice(0, 2).map((attachment, index) => (
                <div
                  key={index}
                  className='bg-muted inline-flex items-center rounded px-2 py-1 text-xs'
                >
                  {attachment.fileName}
                </div>
              ))}
              {totalFiles > 2 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 px-2 text-xs'
                    >
                      +{totalFiles - 2} tệp khác
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-56'>
                    <DropdownMenuLabel>Tất cả tệp đính kèm</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {attachments.map((attachment, index) => (
                      <DropdownMenuItem key={index}>
                        {attachment.fileName}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <span className='text-muted-foreground text-xs'>
              Không có tệp đính kèm
            </span>
          )}
        </div>
      )
    },
    enableColumnFilter: false,
  },
  {
    id: 'actions',
    enableHiding: false,
    maxSize: 24,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Hành động' />
    ),
    cell: ({ row }) => {
      const document = row.original
      const hasAttachments = document.attachments.length > 0

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Xem tệp</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>
              Tệp đính kèm ({document.attachments.length})
            </DropdownMenuLabel>
            {hasAttachments ? (
              document.attachments.map((attachment, index) => (
                <DropdownMenuItem
                  key={index}
                  onSelect={() => {
                    window.alert(`Tải xuống tệp: ${attachment.fileName}`)
                  }}
                >
                  {attachment.fileName}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                Không có tệp đính kèm
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function SelectDocumentDialog({
  open,
  onOpenChange,
  onSaveDocuments,
}: Props) {
  const { table, debounceMs, shallow, throttleMs } = useDataTable({
    data: data,
    columns,
    pageCount: 1,
    getRowId: (row) => String(row.documentId ?? 'unknown'),
  })

  const handleSaveSelection = () => {
    const selectedDocuments = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original)

    if (onSaveDocuments) {
      onSaveDocuments(selectedDocuments)
    }
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
      }}
    >
      <DialogContent className='max-h-7xl flex flex-col sm:max-w-7xl'>
        <DialogHeader className='text-left'>
          <DialogTitle>Chọn tài liệu</DialogTitle>
          <DialogDescription>
            Chọn một hoặc nhiều tài liệu từ danh sách dưới đây
          </DialogDescription>
        </DialogHeader>
        <div className='flex-1 overflow-hidden'>
          <ScrollArea className='h-full'>
            <DataTable table={table}>
              <DataTableAdvancedToolbar table={table}>
                <DataTableFilterMenu
                  table={table}
                  shallow={shallow}
                  debounceMs={debounceMs}
                  throttleMs={throttleMs}
                />
              </DataTableAdvancedToolbar>
            </DataTable>
          </ScrollArea>
        </div>
        <DialogFooter className='gap-2'>
          <DialogClose asChild>
            <Button variant='outline'>Đóng</Button>
          </DialogClose>
          <Button onClick={handleSaveSelection}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
