import { component$ } from '@builder.io/qwik';
import { Drawer } from '@qwik-ui/headless';

export default component$(() => {
  return (
    <>
      <h2>This is the documentation for the Drawer</h2>
      <Drawer.Root class="drawer">
        <Drawer.Trigger>
          <input id="my-drawer" type="checkbox" class="drawer-toggle" />
          <div class="drawer-content">
            <label for="my-drawer" class="btn btn-primary drawer-button">
              Open drawer
            </label>
          </div>
        </Drawer.Trigger>
        <Drawer.Content class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu bg-base-100 text-base-content w-80 p-4">
            <li>
              <a href="/" target="_blank">
                Homepage
              </a>
            </li>
            <li>
              <a href="https://github.com/qwikifiers/qwik-ui" target="_blank">
                QwikUI
              </a>
            </li>
            <li>
              <a href="https://qwik.builder.io/" target="_blank">
                Qwik
              </a>
            </li>
          </ul>
        </Drawer.Content>
      </Drawer.Root>
    </>
  );
});
