/**
 * VERY simple auth context
 * Desc: VERY simple auth context for saving logged in users credentials
 */

import { createContext } from 'react';

export interface UserCredentials {
    uid: string;
    name?: string;
    email: string;
    avatar_url?: string;
}

export const UserContext = createContext<UserCredentials>({
    uid: '',
    email: '',
});