import { useMemo } from 'react';
import { User } from '@auth/user';
import useAuth from '@auth/services/jwt/useJwtAuth'; // ✅ Corrected path
import _ from 'lodash';
import setIn from '@/utils/setIn';

type useUser = {
	data: User | null;
	isGuest: boolean;
	updateUser: (updates: Partial<User>) => Promise<User | undefined>;
	updateUserSettings: (newSettings: User['settings']) => Promise<User['settings'] | undefined>;
	signOut: () => void;
};

function useUser(): useUser {
	const { user, signOut, updateUser } = useAuth();

	const isGuest = useMemo(() => {
		if (!user?.role) return true;
		if (Array.isArray(user.role)) return user.role.length === 0;
		return false;
	}, [user]);

	async function handleUpdateUser(_data: Partial<User>) {
		const response = await updateUser(_data);

		if (!response.ok) {
			throw new Error('Failed to update user');
		}

		const updatedUser = (await response.json()) as User;
		return updatedUser;
	}

	async function handleUpdateUserSettings(newSettings: User['settings']) {
		const newUser = setIn(user, 'settings', newSettings) as User;

		if (_.isEqual(user, newUser)) {
			return undefined;
		}

		const updatedUser = await handleUpdateUser(newUser);
		return updatedUser?.settings;
	}

	async function handleSignOut() {
		return signOut();
	}

	return {
		data: user,
		isGuest,
		signOut: handleSignOut,
		updateUser: handleUpdateUser,
		updateUserSettings: handleUpdateUserSettings
	};
}

export default useUser;
