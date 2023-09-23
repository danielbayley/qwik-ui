import { PopoverImpl } from './popover-impl';
import { useSignal } from '@builder.io/qwik';

import {
  type QwikIntrinsicElements,
  component$,
  useVisibleTask$,
  Signal,
  Slot,
} from '@builder.io/qwik';
import {
  ReferenceElement,
  autoUpdate,
  computePosition,
  offset as _offset,
  flip as _flip,
  shift as _shift,
  autoPlacement as _autoPlacement,
  hide as _hide,
} from '@floating-ui/dom';
import { getPopoverParent } from './utils';

declare global {
  interface Document {
    __NEEDS_POPOVER__?: true;
  }
  interface HTMLDivElement {
    popover?: 'manual' | 'auto' | true;
  }
}

export type PopoverProps = {
  preset: 'listbox' | 'none';
  id: string;
  anchorRef?: Signal<HTMLElement | undefined>;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;
  gutter?: number;
  shift?: boolean;
  flip?: boolean;
  size?: boolean;
  autoPlacement?: boolean;
  hide?: 'referenceHidden' | 'escaped';
  inline?: boolean;
  transform?: string;
} & QwikIntrinsicElements['div'];

export const Popover = component$(
  ({
    anchorRef,
    gutter,
    flip = true,
    placement = 'bottom-start',
    shift,
    hide,
    autoPlacement = false,
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false,
    transform,
    ...props
  }: PopoverProps) => {
    const popoverRef = useSignal<HTMLElement>();

    // sets floating UI config
    useVisibleTask$(({ track, cleanup }) => {
      if (!anchorRef || !anchorRef.value) return;
      const anchor = track(() => anchorRef.value);

      const updatePosition = async () => {
        const middleware = [
          _offset(gutter),
          _hide({ strategy: hide }),
          flip && _flip(),
          shift && _shift(),
          autoPlacement && _autoPlacement(),
        ];

        if (!popoverRef.value) {
          throw new Error('Qwik UI: Popover Element not found.');
        }

        if (anchorRef.value) {
          await computePosition(
            anchorRef?.value as ReferenceElement,
            getPopoverParent(popoverRef.value),
            {
              placement,
              middleware,
            },
          ).then((resolvedData) => {
            if (!popoverRef.value) return;

            const { x, y } = resolvedData;

            Object.assign(popoverRef.value.style, {
              left: `${x}px`,
              top: `${y}px`,
              transform,
            });
          });
        }
      };

      if (!popoverRef.value) {
        throw new Error('Qwik UI: Popover Element not found.');
      }

      const cleanupFunc = autoUpdate(
        anchor as ReferenceElement,
        getPopoverParent(popoverRef.value),
        updatePosition,
        {
          ancestorScroll,
          ancestorResize,
          elementResize,
          animationFrame,
        },
      );
      cleanup(cleanupFunc);
    });
    return (
      <PopoverImpl {...props} ref={popoverRef}>
        <Slot />
      </PopoverImpl>
    );
  },
);
