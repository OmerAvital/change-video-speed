import React, {
  FC, ButtonHTMLAttributes, cloneElement, ReactElement, PropsWithChildren,
} from 'react';
import { clean } from 'utils';

type El = ReactElement<PropsWithChildren<SVGElement>>;
export interface IconBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactElement | string;
}

const IconBtn: FC<IconBtnProps> = ({
  children, className, disabled, ...props
}: IconBtnProps) => {
  const childWithProps = React.Children.map(children,
    child => {
      const item: El = (typeof child === 'string') ? <span>{child}</span> : child;
      return cloneElement(item, {
        className: clean`stroke-inherit ${item.props.className ?? ''}`,
      });
    });

  return (
    <button
      className={`relative grid place-items-center w-6 h-6 p-1.5 z-0 rounded-full
                  stroke-zinc-700 dark:stroke-zinc-400 dark:hover:stroke-zinc-300 dark:hover:disabled:stroke-zinc-400
                  after:absolute after:inset-0 after:rounded-full after:-z-10 after:bg-zinc-200 after:dark:bg-zinc-700
                  after:scale-0 motion-safe:after:transition-transform hover:after:scale-100
                  disabled:opacity-40 disabled:cursor-default disabled:hover:after:scale-0 ${className ?? ''}`}
      type="button"
      disabled={disabled}
      {...props}
    >
      {childWithProps}
    </button>
  );
};

export default IconBtn;
