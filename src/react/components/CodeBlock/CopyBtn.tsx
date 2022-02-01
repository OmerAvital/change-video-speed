import React, {
  FC, useState, useRef, RefObject, useEffect,
} from 'react';
import { ClipboardListIcon, CheckIcon, XIcon } from '@heroicons/react/outline';
import { useCopyToClipboard, useDebounce, useHoverDirty } from 'react-use';
import { FadeInOut } from 'components';

interface CopyBtnProps {
  content: string;
  className?: string;
  buttonClassName?: string;
  parent: RefObject<Element>;
}

const CopyBtn: FC<CopyBtnProps> = ({
  content,
  className,
  buttonClassName,
  parent,
}: CopyBtnProps) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [showMsg, setShowMsg] = useState(false);
  const [appear, setAppear] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const hoverParent = useHoverDirty(parent);
  const hoverSelf = useHoverDirty(divRef);

  useDebounce(() => {
    setShowMsg(false);
  }, 1500, [state]);
  useEffect(() => {
    setAppear(hoverSelf || hoverParent || showMsg);
  }, [hoverSelf, hoverParent, showMsg]);

  const ConfirmationIcon = state.error
    ? <XIcon className="stroke-red-400 dark:stroke-red-600" />
    : <CheckIcon className="stroke-green-500 dark:stroke-green-600" />;

  return (
    <FadeInOut show={appear}>
      <div className={`flex items-center gap-1.5 ${className ?? ''}`} ref={divRef}>
        <FadeInOut show={showMsg}>
          <span className="block font-semibold text-sm">
            {state.error ? 'Failed to copy!' : 'Copied!'}
          </span>
        </FadeInOut>

        <button
          type="button"
          className={`w-7 h-8 p-0.75 rounded bg-white/50 dark:bg-zinc-500/50
                    transition-colors transition-opacity hover:opacity-100 hover:bg-white hover:dark:bg-zinc-500
                    ${showMsg ? 'border' : 'opacity-60 ring-1 ring-inset ring-zinc-700 dark:ring-zinc-300'}
                    ${state.error ? 'border-red-400 dark:border-red-600' : 'border-green-500 dark:border-green-600'}
                    ${buttonClassName ?? ''}`}
          onClick={() => {
            copyToClipboard(content);
            setShowMsg(true);
          }}
          title="Copy to clipboard"
        >
          {showMsg
            ? ConfirmationIcon
            : <ClipboardListIcon />}
        </button>
      </div>
    </FadeInOut>
  );
};

CopyBtn.defaultProps = {
  className: '',
  buttonClassName: '',
};

export default CopyBtn;
