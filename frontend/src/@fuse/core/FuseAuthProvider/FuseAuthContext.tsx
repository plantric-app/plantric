import { createContext } from 'react';
import { FuseAuthProviderState, FuseAuthProviderType } from './types/FuseAuthTypes';
import { PartialDeep } from 'type-fest';
import { User } from '@auth/user';

export type AuthState = FuseAuthProviderState & {
	provider: string | null;
};

// eslint-disable-next-line react-refresh/only-export-components
export const initialAuthState: AuthState = {
	authStatus: null,
	isAuthenticated: false,
	user: null,
	provider: null
};

export type FuseAuthContextType = {
	updateUser?: (U: PartialDeep<User>) => Promise<Response>;
	signOut?: () => void;
	authStatus: FuseAuthProviderState['authStatus'];
	isAuthenticated: boolean;
	user: User | null;
	providers: FuseAuthProviderType[];
};


const FuseAuthContext = createContext<FuseAuthContextType>({
	authStatus: null,
	isAuthenticated: false,
	user: null,
	providers: []
});


export default FuseAuthContext;
