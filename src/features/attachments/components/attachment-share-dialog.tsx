import { useState } from 'react'
import { ChevronDown, Globe, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'
import { AppDialogInstance } from '@/hooks/use-dialog-instance'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxBadgeItem,
  ComboboxBadgeList,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { AppDialog } from '@/components/app-dialog'
import { useUsersSharedWithFile } from '../hooks/use-user-shared-with-file'
import { MyAttachmentItem } from '../types'

interface AttachmentShareDialogProps {
  attachment: MyAttachmentItem
  dialog: AppDialogInstance
}

// Mock data for demo purposes
const mockUsers = [
  {
    id: 1,
    name: 'domtuan21',
    email: 'domtuan21@gmail.com',
    role: 'Owner',
    avatar: 'DT',
    color: 'blue',
  },
  {
    id: 2,
    name: 'hungify (you)',
    email: 'nmhungify@gmail.com',
    role: 'Viewer',
    avatar: 'H',
    color: 'teal',
  },
  {
    id: 3,
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    role: 'Viewer',
    avatar: 'AC',
    color: 'green',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Viewer',
    avatar: 'SW',
    color: 'purple',
  },
  {
    id: 5,
    name: 'David Park',
    email: 'david.park@company.com',
    role: 'Viewer',
    avatar: 'DP',
    color: 'orange',
  },
  {
    id: 6,
    name: 'Isabella Martinez',
    email: 'isabella.martinez@company.com',
    role: 'Viewer',
    avatar: 'IM',
    color: 'pink',
  },
  {
    id: 7,
    name: 'Michael Johnson',
    email: 'michael.johnson@company.com',
    role: 'Viewer',
    avatar: 'MJ',
    color: 'blue',
  },
  {
    id: 8,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'Viewer',
    avatar: 'ER',
    color: 'teal',
  },
  {
    id: 9,
    name: 'James Smith',
    email: 'james.smith@company.com',
    role: 'Viewer',
    avatar: 'JS',
    color: 'green',
  },
  {
    id: 10,
    name: 'Lisa Thompson',
    email: 'lisa.thompson@company.com',
    role: 'Viewer',
    avatar: 'LT',
    color: 'purple',
  },
  {
    id: 11,
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    role: 'Viewer',
    avatar: 'RB',
    color: 'orange',
  },
  {
    id: 12,
    name: 'Jennifer Davis',
    email: 'jennifer.davis@company.com',
    role: 'Viewer',
    avatar: 'JD',
    color: 'pink',
  },
  {
    id: 13,
    name: 'Kevin Lee',
    email: 'kevin.lee@company.com',
    role: 'Viewer',
    avatar: 'KL',
    color: 'blue',
  },
  {
    id: 14,
    name: 'Amanda Garcia',
    email: 'amanda.garcia@company.com',
    role: 'Viewer',
    avatar: 'AG',
    color: 'teal',
  },
  {
    id: 15,
    name: 'Daniel White',
    email: 'daniel.white@company.com',
    role: 'Viewer',
    avatar: 'DW',
    color: 'green',
  },
]

interface UserAccessListProps {
  onRemoveUser: (userId: number) => void
  attachment: MyAttachmentItem
}

function UserAccessList({ onRemoveUser, attachment }: UserAccessListProps) {
  const { data: sharedUsers } = useUsersSharedWithFile(attachment.id!)

  const { user: loggedInUser } = useAuth()

  const sharedUserList = sharedUsers?.data ?? []

  if (sharedUserList.length === 0) {
    return (
      <div className='text-muted-foreground text-sm'>
        No users have access to this file.
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col space-y-3'>
      <Label className='text-sm font-medium'>People with access</Label>
      <div className='flex-1 space-y-2 overflow-y-auto px-4'>
        {sharedUserList.map((user) => (
          <div key={user.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-8 w-8 bg-gray-100 text-gray-600'>
                <AvatarFallback>{user.sharedWith?.name}</AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <div className='truncate text-sm font-medium'>
                  {user.sharedWith?.name}
                </div>
                <div className='text-muted-foreground truncate text-xs'>
                  {user.sharedWith?.email}
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='text-muted-foreground text-sm'>
                {user.permission}
              </div>
              {user.sharedBy?.id === loggedInUser?.id && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-6 w-6'>
                      <Trash2 className='text-destructive h-3 w-3' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove user</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Available users for adding to share (excluding already shared users)
const availableUsers = [
  {
    value: 'john.doe@company.com',
    label: 'John Doe',
    email: 'john.doe@company.com',
  },
  {
    value: 'mary.jane@company.com',
    label: 'Mary Jane',
    email: 'mary.jane@company.com',
  },
  {
    value: 'peter.parker@company.com',
    label: 'Peter Parker',
    email: 'peter.parker@company.com',
  },
  {
    value: 'tony.stark@company.com',
    label: 'Tony Stark',
    email: 'tony.stark@company.com',
  },
  {
    value: 'bruce.banner@company.com',
    label: 'Bruce Banner',
    email: 'bruce.banner@company.com',
  },
  {
    value: 'natasha.romanoff@company.com',
    label: 'Natasha Romanoff',
    email: 'natasha.romanoff@company.com',
  },
]

export function AttachmentShareDialog({
  attachment,
  dialog,
}: AttachmentShareDialogProps) {
  const [accessLevel, setAccessLevel] = useState('restricted')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/files/${attachment.id}/share`
    navigator.clipboard.writeText(shareLink)
    toast.success('Link copied to clipboard!')
  }

  const handleRemoveUser = (userId: number) => {
    // TODO: Implement user removal logic
    toast.success('User removed from sharing!')
  }

  const handleAddUsers = () => {
    if (selectedUsers.length > 0) {
      // TODO: Implement adding users logic
      toast.success(`Added ${selectedUsers.length} user(s) to sharing!`)
      setSelectedUsers([])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(inputValue.trim())) {
        const newEmail = inputValue.trim()
        if (!selectedUsers.includes(newEmail)) {
          setSelectedUsers([...selectedUsers, newEmail])
        }
        setInputValue('')
      } else {
        toast.error('Please enter a valid email address')
      }
    }
  }

  return (
    <AppDialog dialog={dialog}>
      <DialogContent className='flex h-[80vh] max-h-[800px] flex-col sm:max-w-2xl'>
        <DialogHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <DialogTitle className='flex items-center gap-2'>
            Share {attachment.fileName || 'Attachment'}
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-1 flex-col overflow-hidden'>
          <div className='space-y-2 px-1'>
            <Combobox
              value={selectedUsers}
              onValueChange={setSelectedUsers}
              className='w-full'
              multiple
              autoHighlight
            >
              <ComboboxLabel>Add people</ComboboxLabel>
              <ComboboxAnchor className='h-full min-h-10 flex-wrap px-3 py-2'>
                <ComboboxBadgeList>
                  {selectedUsers.map((userEmail) => {
                    const user = availableUsers.find(
                      (u) => u.value === userEmail
                    )
                    if (!user) return null

                    return (
                      <ComboboxBadgeItem key={userEmail} value={userEmail}>
                        {user.label}
                      </ComboboxBadgeItem>
                    )
                  })}
                </ComboboxBadgeList>
                <ComboboxInput
                  placeholder='Add people, groups, and calendar events'
                  className='h-auto min-w-20 flex-1'
                />
                <ComboboxTrigger className='absolute top-3 right-2'>
                  <ChevronDown className='h-4 w-4' />
                </ComboboxTrigger>
              </ComboboxAnchor>
              <ComboboxContent>
                <ComboboxEmpty>No users found.</ComboboxEmpty>
                {availableUsers.map((user) => (
                  <ComboboxItem key={user.value} value={user.value}>
                    <div className='flex flex-col'>
                      <span>{user.label}</span>
                      <span className='text-muted-foreground text-xs'>
                        {user.email}
                      </span>
                    </div>
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
            {selectedUsers.length > 0 && (
              <div className='flex justify-end'>
                <Button onClick={handleAddUsers} size='sm'>
                  Add {selectedUsers.length} user(s)
                </Button>
              </div>
            )}
          </div>

          <Separator className='my-4' />

          <div className='flex-1 overflow-hidden'>
            <UserAccessList
              onRemoveUser={handleRemoveUser}
              attachment={attachment}
            />
          </div>

          <Separator className='my-4' />

          <div className='space-y-3 px-1'>
            <Label className='text-sm font-medium'>General access</Label>
            <div className='flex items-center gap-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100'>
                {accessLevel === 'restricted' ? (
                  <Users className='h-4 w-4 text-gray-600' />
                ) : (
                  <Globe className='h-4 w-4 text-gray-600' />
                )}
              </div>
              <div className='flex-1'>
                <Select value={accessLevel} onValueChange={setAccessLevel}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='restricted'>Restricted</SelectItem>
                    <SelectItem value='anyone'>Anyone with the link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className='text-muted-foreground text-xs'>
              {accessLevel === 'restricted'
                ? 'Only people with access can open with the link'
                : 'Anyone on the internet with this link can view'}
            </p>
          </div>

          <div className='flex justify-between px-1 pt-4'>
            <Button variant='outline' onClick={handleCopyLink}>
              Close
            </Button>
            <Button
              onClick={dialog.close}
              className='bg-blue-600 hover:bg-blue-700'
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </AppDialog>
  )
}

AttachmentShareDialog.useDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  }
}
