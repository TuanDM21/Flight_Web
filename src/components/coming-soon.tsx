import { IconPlanet } from '@tabler/icons-react'

export default function ComingSoon() {
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <IconPlanet size={72} />
        <h1 className='text-4xl leading-tight font-bold'>Sắp ra mắt 👀</h1>
        <p className='text-muted-foreground text-center'>
          Trang này chưa được tạo. <br />
          Hãy chờ đón nhé!
        </p>
      </div>
    </div>
  )
}
