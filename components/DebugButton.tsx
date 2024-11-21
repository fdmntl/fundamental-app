import { usePrivy } from '@privy-io/expo';
import { useAppData } from './Wrappers/AppData';
import React from 'react';

import { Button } from './Button';

export const DebugButton = () => {
    const { user } = useAppData();
    const { user : privyUser } = usePrivy();

    const debug = async () => {
        console.log('User:', user);
        console.log('Privy User:', privyUser);
    };

    return (
        <Button onPress={debug} className="bg-primary" title="Debug" />
    )
};