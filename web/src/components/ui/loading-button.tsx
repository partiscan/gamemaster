import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import { Button, ButtonProps } from './button';

export interface LoadingButtonProps extends Omit<ButtonProps, 'asChild'> {
  loading?: boolean;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, children, ...props }, ref) => {
    return (
      <Button ref={ref} {...props}>
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        {children}
      </Button>
    );
  },
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
