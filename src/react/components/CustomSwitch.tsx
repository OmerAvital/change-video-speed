import React, {
  FC, useEffect, useRef, useState, useCallback,
} from 'react';
import { Switch } from '@headlessui/react';

interface CustomSwitchProps {
  checked: boolean;
  onChange(checked: boolean): void;
}

const WIDTH = 1.25 * 16;

const CustomSwitch: FC<CustomSwitchProps> = ({ checked, onChange }: CustomSwitchProps) => {
  const [mouseX, setMouseX] = useState<number>();
  const [dragging, setDragging] = useState(false);
  const startingMouseX = useRef<number>();
  const startingCheckedValue = useRef<boolean>(checked);
  const circle = useRef<HTMLSpanElement>(null);

  const endDrag = useCallback(() => {
    setMouseX(undefined);
    startingMouseX.current = undefined;
  }, [setMouseX, startingMouseX]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (startingMouseX.current === undefined) return;
      setDragging(true);
      let delta = e.clientX - startingMouseX.current;
      if (startingCheckedValue.current) delta += WIDTH;
      const offset = Math.min(Math.max(delta, 0), 20);
      setMouseX(offset);
      onChange(offset > WIDTH / 2);
    };
    const handleMouseUp = (e: MouseEvent) => {
      endDrag();
      if (e.target !== circle.current) {
        setDragging(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [endDrag, onChange]);

  return (
    <Switch
      checked={checked}
      onChange={isChecked => {
        let c;
        if (dragging) {
          setDragging(false);
          c = checked;
        } else {
          onChange(isChecked);
          c = isChecked;
        }
        startingCheckedValue.current = c;
      }}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200
                  ${checked ? 'bg-yellow-400 dark:bg-yellow-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
      onContextMenu={endDrag}
      onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.target !== circle.current) return;
        startingMouseX.current = e.clientX;
      }}
    >
      <span
        ref={circle}
        className={`absolute left-0.5 top-0.5 block w-5 h-5 rounded-full shadow bg-white dark:bg-zinc-300
                    ${dragging ? '' : 'motion-safe:transition-transform'}`}
        style={{
          transform: `translateX(${mouseX ?? (checked ? WIDTH : 0)}px)`,
        }}
      />
    </Switch>
  );
};

export default CustomSwitch;
