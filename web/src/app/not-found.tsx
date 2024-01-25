import Image from 'next/image';

export default function NotFound() {
  return <div className='flex w-full items-center h-full justify-center flex-col gap-4'>
      <div className='text-xl font-semibold'>
        Page not found
      </div>
      <Image src='/assets/404.webp' alt='404' width={256} height={256} className='border border-slate-200' />
    </div>
}
