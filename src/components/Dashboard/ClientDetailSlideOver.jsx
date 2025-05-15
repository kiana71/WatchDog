import React from 'react';
import SlideOver from '../common/SlideOver';
import ClientQuickView from '../ClientDetail/ClientQuickView';
import { useClients } from '../../context/ClientsContext';

/**
 * Component to display client details in a slide-over panel
 * @param {Object} props - Component props
 * @param {Object} props.client - Client to display
 * @param {boolean} props.isOpen - Whether the slide-over is open
 * @param {function} props.onClose - Function to call when closing the slide-over
 */
const ClientDetailSlideOver = ({
  client,
  isOpen,
  onClose,
}) => {
  const { restartClient } = useClients();

  const handleClientUpdated = async () => {
    if (client) {
      const clientId = client.id || client._id;
      await restartClient(clientId);
    }
  };

  return (
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title={client?.name || 'Client Details'}
      width="max-w-md"
    >
      <ClientQuickView
        client={client}
        onClientUpdated={handleClientUpdated}
      />
    </SlideOver>
  );
};

export default ClientDetailSlideOver;