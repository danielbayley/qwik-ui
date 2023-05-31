import {
  $,
  QwikMouseEvent,
  Slot,
  component$,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
} from '@builder.io/qwik';
import styles from './dialog.root.css?inline';
import { RootProps } from './types';
import { ensureDialog, hasDialogBackdropBeenClicked } from './utils';

export const Root = component$((props: RootProps) => {
  useStylesScoped$(styles);

  /** Contains reference to the rendered HTMLDialogElement. */
  const dialogElement = useSignal<HTMLDialogElement>();

  /** Indicates whether the dialog is open. */
  const opened = useSignal(false);

  const open = $(() => {
    const dialog = ensureDialog(dialogElement.value);

    dialog.showModal();
    opened.value = true;
  });

  const close = $(() => {
    const dialog = ensureDialog(dialogElement.value);

    dialog.close();
    opened.value = false;
  });

  const closeOnBackdropClick = $(
    (event: QwikMouseEvent<HTMLDialogElement, MouseEvent>) =>
      hasDialogBackdropBeenClicked(event) ? close() : Promise.resolve()
  );

  /**
   *
   * Share the public API of the Dialog if the dialog-caller is interested.
   *
   */
  useVisibleTask$(() => {
    if (!props.ref) return;

    props.ref.value = { isOpen: opened, open, close };
  });

  /**
   *
   * Lock Scrolling on page when Dialog is opened.
   *
   */
  useVisibleTask$(({ track }) => {
    const isOpened = track(() => opened.value);

    const overflow = isOpened ? 'hidden' : '';

    window.document.body.style.overflow = overflow;
  });

  /**
   *
   * When dialog is closed by pressing the Escape-Key,
   * we set the opened state to false.
   *
   */
  useVisibleTask$(() => {
    const dialog = ensureDialog(dialogElement.value);

    dialog.addEventListener('close', () => (opened.value = false));
  });

  return (
    <dialog
      {...props}
      class={props.fullScreen ? `${props.class} full-screen` : `${props.class}`}
      ref={dialogElement}
      onClick$={closeOnBackdropClick}
    >
      <Slot />
    </dialog>
  );
});
