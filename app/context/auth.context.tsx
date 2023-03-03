import { useContext, createContext } from 'react';

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