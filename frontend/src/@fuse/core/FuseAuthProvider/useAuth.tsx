import { useContext } from 'react';
import JwtAuthContext, { JwtAuthContextType } from '@auth/services/jwt/JwtAuthContext';

function useAuth(): JwtAuthContextType {
	const context = useContext(JwtAuthContext);

	if (!context) {
		throw new Error('useAuth must be used within a JwtAuthProvider');
	}

	return context;
}

export default useAuth;