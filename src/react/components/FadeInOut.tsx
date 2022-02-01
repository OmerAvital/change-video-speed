import React, { FC, HTMLAttributes } from 'react';
import { Transition } from '@headlessui/react';

interface FadeInOutProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
}

const FadeInOut: FC<FadeInOutProps> = ({ children, show }: FadeInOutProps) => (
  <Transition
    enter="transition"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="transition"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
    show={show}
  >
    {children}
  </Transition>
);

export default FadeInOut;
