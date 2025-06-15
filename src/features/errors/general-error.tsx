import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface GeneralErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  minimal?: boolean
}

export default function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>Oops! Đã có lỗi xảy ra {`:')`}</span>
        <p className='text-muted-foreground text-center'>
          Chúng tôi xin lỗi vì sự bất tiện này. <br /> Vui lòng thử lại sau.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button
              variant='outline'
              onClick={() => {
                history.go(-1)
              }}
            >
              Quay lại
            </Button>
            <Button onClick={() => void navigate({ to: '/' })}>
              Về trang chủ
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
