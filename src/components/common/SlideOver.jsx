import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X } from 'lucide-react';

/**
 * A reusable slide-over panel component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {function} props.onClose - Function to call when closing the panel
 * @param {React.ReactNode} props.title - Panel title
 * @param {React.ReactNode} props.children - Panel content
 * @param {string} props.width - Panel width (max-w-md, max-w-xl, etc.)
 */
const SlideOver = ({
  isOpen,
  onClose,
  title,
  children,
  width = 'max-w-md'
}) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className={`pointer-events-auto w-screen ${width}`}>
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 shadow-xl">
                    <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        {typeof title === 'string' ? (
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            {title}
                          </Dialog.Title>
                        ) : (
                          <div>{title}</div>
                        )}
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                          onClick={onClose}
                        >
                          <span className="sr-only">Close panel</span>
                          <X size={20} aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 sm:px-6">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOver; 