import { FC, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from '../atoms/Button';

type Props = {
  message: string;
  onClickOK: () => void;
  open: boolean;
  setOpen: (b: boolean) => void;
};

export const Component: FC<Props> = ({ message, open, setOpen, onClickOK }) => (
  <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="py-3 text-center sm:text-left">
                    <p className="text-sm text-slate-600">{message}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 flex gap-2 flex-row-reverse">
                <Button
                  text="OK"
                  onClick={() => {
                    onClickOK();
                    setOpen(false);
                  }}
                />
                <Button text="Cancel" onClick={() => setOpen(false)} />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);

const Container: FC<Props> = ({ message, onClickOK, open, setOpen }) => (
  <Component message={message} open={open} setOpen={setOpen} onClickOK={onClickOK} />
);

export default Container;
