import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

export const GameSubheader: FC<Props> = ({ children }) => {
  return <div className="text-gray-500 text-sm max-w-md mx-auto">{children}</div>;
};
