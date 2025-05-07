import {
	useState,
	useEffect,
	useCallback,
	// useMemo,
	useImperativeHandle
} from 'react';
import {
	FuseAuthProviderComponentProps,
	FuseAuthProviderState
} from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import useLocalStorage from '@fuse/hooks/useLocalStorage';
import { User } from '../../user';
import { removeGlobalHeaders, setGlobalHeaders } from '@/utils/apiFetch';
import JwtAuthContext from '@auth/services/jwt/JwtAuthContext';
import { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';
import { useNavigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import jwtDecode from 'jwt-decode';
import { isEmpty } from 'lodash';
import { JwtUser } from '@auth/user/types/JwtUser';
import { decode } from 'punycode';
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
    
//     Check this file for the main branch
		if (authState.authStatus === 'configuring') {
			const token = tokenStorageValue;
			if (token) {
				try {
					const decoded = jwtDecode<DecodedToken>(token);
					const expiresAt = decoded.exp * 1000;
					const currentTime = Date.now();
					if (expiresAt < currentTime) {
						removeTokenStorageValue();
						removeGlobalHeaders(['Authorization']);
						setAuthState({
							authStatus: 'unauthenticated',
							isAuthenticated: false,
							user: null
						});
						navigate('/sign-in');
						setLoading(false);
						return;
					}

					const { name, email, role } = decoded.sub;

// Check this too, which one is correct?
		const attemptAutoLogin = async () => {
			const token = tokenStorageValue;
			// console.log("token: " + token)

			if (!token) return false;

			try {
				const res = await fetch('http://localhost:5050/api/auth/me', {
					headers: {
						Authorization: `Bearer ${token}`
					}
				});

				if (!res.ok) return false;

				const user = await res.json();
				// console.log('👤 Auto-login user from /me:', user);

				if (!user?.email || !user?.role) {
					// console.warn('❌ Invalid user object returned from /me. Logging out.');
					return false;
				}

				return user;
			} catch {
				return false;
			}
		};

		if (authState.authStatus === 'configuring') {
			// console.log('🔁 Attempting auto-login...');
			attemptAutoLogin().then((user) => {
				if (user) {
					// console.log('✅ Auto-login successful:', user);
// Code used to end here
          
					setAuthState({
						authStatus: 'authenticated',
						isAuthenticated: true,
						user: {
							displayName: name,
							email: email,
							role: Array.isArray(role) ? role : [role]
						} as User
					});

//           Updated or Old 
					setGlobalHeaders({ Authorization: `Bearer ${token}` });
				} catch (error) {
          
          
//           Check with main branch for this code
					setGlobalHeaders({ Authorization: `Bearer ${tokenStorageValue}` });
				} else {
					// console.warn('⛔ Auto-login failed. Logging out.');

					removeTokenStorageValue();
					removeGlobalHeaders(['Authorization']);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
					navigate('/sign-in');
				}
			} else {
				removeGlobalHeaders(['Authorization']);
				setAuthState({
					authStatus: 'unauthenticated',
					isAuthenticated: false,
					user: null
				});
				navigate('/sign-in');
			}

			setLoading(false);
		}
	}, [authState.authStatus]);

	const signIn: JwtAuthContextType['signIn'] = useCallback(
		async (credentials) => {
			const res = await fetch('http://localhost:5001/api/auth/signin', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(credentials)
			});

			const data = await res.json();
			if (!res.ok) {
				throw new FetchApiError(res.status, data);
			}
			if (res.ok) {
				setTokenStorageValue(data.access_token);
				setGlobalHeaders({ Authorization: `Bearer ${data.access_token}` });
				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: data.user
				});
				navigate('/');
			}

			return res;
		},
		[setTokenStorageValue]
	);

	const signUp: JwtAuthContextType['signUp'] = useCallback(
		async (payload) => {
			const res = await fetch('http://localhost:5001/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const data = await res.json();

			if (res.ok) {
				setTokenStorageValue(data.access_token);
				setGlobalHeaders({ Authorization: `Bearer ${data.access_token}` });
				setAuthState({
					authStatus: 'authenticated',
					isAuthenticated: true,
					user: data.user
				});
			}

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
		navigate('/sign-in');
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
	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
}

export default JwtAuthProvider;