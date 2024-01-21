import {
  ComponentProps,
  FC,
  startTransition,
  useCallback,
  useState,
} from 'react';
import { Spinner } from './spinner';
import { Button } from './ui/button';

type Props = Omit<ComponentProps<typeof Button>, 'onClick'> & {
  onClick?: () => Promise<boolean>;
};

export const SpinnerButton: FC<Props> = ({ onClick, ...rest }) => {
  const [spinner, setSpinner] = useState(false);

  const spinnerClick = useCallback(async () => {
    setSpinner(true);
    if (onClick) {
      startTransition(() => {
        onClick()
          .then((v) => setSpinner(v))
          .catch((e) => {
            console.log(e);
            setSpinner(false);
          });
      });
    }
  }, [onClick]);

  return (
    <Button onClick={spinnerClick} {...rest} disabled={spinner}>
      {spinner ? <Spinner /> : rest.children}
    </Button>
  );
};
