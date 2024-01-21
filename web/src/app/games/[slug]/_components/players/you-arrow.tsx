import { FC } from 'react';

type Props = {
  className?: string;
};

export const YouArrow: FC<Props> = ({ className }) => {
  return (
    <svg className={className} viewBox='-50 0 800 800'>
      <g
        strokeWidth='32'
        stroke='hsl(105, 69%, 30%)'
        fill='none'
        strokeLinecap='round'
        strokeLinejoin='round'
        transform='matrix(-0.6691306063588582,0.7431448254773942,-0.7431448254773942,-0.6691306063588582,905.910172734501,221.3943123525856)'
      >
        <path
          d='M180.75094771385193 179Q137.75094771385193 506 622.7509477138519 621 '
          markerEnd='url(#SvgjsMarker3388)'
        ></path>
      </g>
      <defs>
        <marker
          markerWidth='10'
          markerHeight='10'
          refX='5'
          refY='5'
          viewBox='0 0 10 10'
          orient='auto'
          id='SvgjsMarker3388'
        >
          <polyline
            points='0,5 5,2.5 0,0'
            fill='none'
            strokeWidth='1.6666666666666667'
            stroke='hsl(105, 69%, 30%)'
            strokeLinecap='round'
            transform='matrix(1,0,0,1,1.6666666666666667,2.5)'
            strokeLinejoin='round'
          ></polyline>
        </marker>
      </defs>
    </svg>
  );
};
