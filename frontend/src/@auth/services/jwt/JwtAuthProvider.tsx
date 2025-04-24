import {
	useState,
	useEffect,
	useCallback,
	useImperativeHandle,
	useRef
} from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
	FuseAuthProviderComponentProps,
	FuseAuthProviderState
} from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/apiFetch';
import jwtDecode from 'jwt-decode';
import FuseLoading from '@fuse/core/FuseLoading';
import { JwtUser } from '@auth/user/types/JwtUser';
import { FetchApiError } from '@/utils/apiFetch';

interface DecodedToken {
	sub: JwtUser;
	exp: number;
}

export type JwtSignInPayload = {
	email: string;
	password: string;
};

export type JwtSignUpPayload = {
	displayName: string;
	email: string;
	password: string;
};

function JwtAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	const navigate = useNavigate();
	const location = useLocation();
	const hasInitialized = useRef(false);
	const PUBLIC_PATHS = ['/sign-in', '/register', '/404', '/401'];

	const {
		value: tokenStorageValue,
		setValue: setTokenStorageValue,
		removeValue: removeTokenStorageValue
	} = useLocalStorage<string>('jwt_access_token');

	const [loading, setLoading] = useState(true);
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		const token = tokenStorageValue;

		const finish = (newState: FuseAuthProviderState<User>) => {
			setAuthState(newState);
			setLoading(false);
		};

		if (!token) {
			removeGlobalHeaders(['Authorization']);
			finish({
				authStatus: 'unauthenticated',
				isAuthenticated: false,
				user: null
			});
			if (!PUBLIC_PATHS.includes(location.pathname)) {
				navigate('/sign-in');
			}
			return;
		}

		try {
			const decoded = jwtDecode<DecodedToken>(token);
			const expiresAt = decoded.exp * 1000;
			const currentTime = Date.now();

			if (expiresAt < currentTime) {
				removeTokenStorageValue();
				removeGlobalHeaders(['Authorization']);
				finish({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
				if (!PUBLIC_PATHS.includes(location.pathname)) {
					navigate('/sign-in');
				}
				return;
			}

			const { name, email, role } = decoded.sub;
			setGlobalHeaders({ Authorization: `Bearer ${token}` });
			finish({
				authStatus: 'authenticated',
				isAuthenticated: true,
				user: {
					displayName: name,
					email,
					role: Array.isArray(role) ? role : [role]
				} as User
			});
		} catch (error) {
			removeTokenStorageValue();
			removeGlobalHeaders(['Authorization']);
			finish({
				authStatus: 'unauthenticated',
				isAuthenticated: false,
				user: null
			});
			if (!PUBLIC_PATHS.includes(location.pathname)) {
				navigate('/sign-in');
			}
		}
	}, []);

	const signIn: JwtAuthContextType['signIn'] = useCallback(
		async (credentials) => {
			const res = await fetch('http://localhost:5001/api/auth/signin', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(credentials)
			});

			const data = await res.json();
			if (!res.ok) throw new FetchApiError(res.status, data);

			setTokenStorageValue(data.access_token);
			setGlobalHeaders({ Authorization: `Bearer ${data.access_token}` });
			setAuthState({
				authStatus: 'authenticated',
				isAuthenticated: true,
				user: data.user
			});
			navigate('/');
			return res;
		},
		[setTokenStorageValue]
	);

	const signUp: JwtAuthContextType['signUp'] = useCallback(
		async (payload) => {
			const res = await fetch('http://localhost:5001/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});

			const data = await res.json();
			if (!res.ok) throw new FetchApiError(res.status, data);

			setTokenStorageValue(data.access_token);
			setGlobalHeaders({ Authorization: `Bearer ${data.access_token}` });
			setAuthState({
				authStatus: 'authenticated',
				isAuthenticated: true,
				user: data.user
			});
			return res;
		},
		[setTokenStorageValue]
	);

	const signOut = useCallback(() => {
		removeTokenStorageValue();
		removeGlobalHeaders(['Authorization']);
		setAuthState({
			authStatus: 'unauthenticated',
			isAuthenticated: false,
			user: null
		});
		if (!PUBLIC_PATHS.includes(location.pathname)) {
			navigate('/sign-in');
		}
	}, [removeTokenStorageValue]);

	const updateUser: JwtAuthContextType['updateUser'] = useCallback(async (user) => {
		try {
			const res = await fetch('http://localhost:5001/api/auth/update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${tokenStorageValue}`
				},
				body: JSON.stringify(user)
			});
			return res;
		} catch (err) {
			console.error(err);
			return Promise.reject(err);
		}
	}, [tokenStorageValue]);

	const refreshToken: JwtAuthContextType['refreshToken'] = useCallback(async () => {
		const res = await fetch('http://localhost:5001/api/auth/refresh', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${tokenStorageValue}`
			}
		});

		if (!res.ok) throw new Error('Token refresh failed');

		const data = await res.json();
		setTokenStorageValue(data.access_token);
		setGlobalHeaders({ Authorization: `Bearer ${data.access_token}` });
		return data.access_token;
	}, [tokenStorageValue]);

	const authContextValue: JwtAuthContextType = {
		authStatus: authState.authStatus,
		isAuthenticated: authState.isAuthenticated,
		user: authState.user,
		signIn,
		signUp,
		signOut,
		updateUser,
		refreshToken
	};

	useImperativeHandle(ref, () => ({
		signOut,
		updateUser
	}));

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<JwtAuthContext.Provider value={authContextValue}>
			{children}
		</JwtAuthContext.Provider>
	);
}

export default JwtAuthProvider;
