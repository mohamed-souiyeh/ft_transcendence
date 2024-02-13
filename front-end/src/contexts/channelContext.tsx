import { createContext, useContext, useState, PropsWithChildren  } from 'react';

const mokChannel = {
  "id": 1,
  "type": "public",
  "channelName": "hazimo ra3d",
  "channelImage": "",
  "channelDescription": "an epic place to be in",
  "channelPassword": null,
  "ownerId": 0,
  "createdAt": "2024-01-16T13:55:37.481Z",
  "users": [
    {
      "id": 5,
      "username": "slave 3"
    },
    {
      "id": 4,
      "username": "slave 2"
    },
    {
      "id": 3,
      "username": "slave 1"
    },
    {
      "id": 2,
      "username": "msouiyeh"
    },
    {
      "id": 1,
      "username": "mohamed"
    }
  ],
  "usersState": [
    {
      "id": 1,
      "state": "active",
      "role": "owner",
      "untile": null,
      "userId": 1,
      "channelId": 1
    },
    {
      "id": 2,
      "state": "active",
      "role": "modirator",
      "untile": null,
      "userId": 2,
      "channelId": 1
    },
    {
      "id": 3,
      "state": "active",
      "role": "user",
      "untile": null,
      "userId": 3,
      "channelId": 1
    }
  ]
};

type channelType = typeof mokChannel;


interface ChannelContextType {
  channel: channelType | Object;
  setChannel: (channel: channelType) => void;
}

export const ChannelContext = createContext<ChannelContextType>({
  channel: {},
  setChannel: (channel: object) => {},
});


export const ChannelProvider = ({ children }: PropsWithChildren<{}>) => {
  const [channel, setChannel] = useState({});

  return (
    <ChannelContext.Provider value={{ channel, setChannel }}>
      {children}
    </ChannelContext.Provider>
  );
};


export const useChannelContext = () => {
  const context = useContext(ChannelContext);

  if (!context) {
    throw new Error('Context must be used inside the Provider');
  }

  return context;
};




