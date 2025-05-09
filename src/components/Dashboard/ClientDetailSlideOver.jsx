import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { X, Edit2, Check } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import SystemInfo from '../ClientDetail/SystemInfo';
import ScreenshotViewer from '../ClientDetail/ScreenshotViewer';
import { api } from '../../services/api';

const ClientDetailSlideOver = ({
  client,
  isOpen,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(client?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = () => {
    setEditedName(client?.name || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!client || editedName.trim() === '') return;

    try {
      setIsSaving(true);
      await api.updateClient(client.id, { name: editedName.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update client name:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(client?.name || '');
  };

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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 shadow-xl">
                    <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input 
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="text-base font-semibold leading-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter client name"
                              />
                              <button 
                                onClick={handleSave}
                                className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30"
                              >
                                <Check size={16} className="text-green-600 dark:text-green-400" />
                              </button>
                              <button 
                                onClick={handleCancel}
                                className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30"
                              >
                                <X size={16} className="text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                {client?.name}
                              </Dialog.Title>
                              <button 
                                onClick={handleEditClick}
                                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Edit2 size={14} className="text-gray-500 dark:text-gray-400" />
                              </button>
                            </div>
                          )}
                        </div>
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
                    {client && (
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="space-y-6">
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                              Last seen
                            </h3>
                          </div>
                          <ScreenshotViewer
                            screenshot={client.screenshot}
                            isOnline={client.isOnline}
                            lastUpdated={client.lastSeen}
                          />
                          <SystemInfo client={client} />
                        </div>
                      </div>
                    )}
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

export default ClientDetailSlideOver;