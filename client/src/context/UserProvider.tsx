import React, { createContext, useEffect, useState, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import instance from "../axios";
import useToast from "../Hooks/useToast";

// Define the User type
export interface User {
	name: {
		fname: string,
		mname?: string,
		lname?: string,
	},
	_id: string,
	email: string,
	role: string,
	verified: boolean,
	deleted: boolean,
}

export interface BackendTokens {
	token: string;
	expiresIn: number;
	refreshToken: string;
	user: {
		name: {
			fname: string,
			mname?: string,
			lname?: string,
		},
		_id: string,
		email: string,
		role: string,
		verified: boolean,
		deleted: boolean,
	}
}

// Define the context type
interface UserContextType {
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	ready: boolean;
	setReady: React.Dispatch<React.SetStateAction<boolean>>;
	error: string | null;
	authenticated: boolean;
	login: (backendTokens: BackendTokens) => void;
	logout: () => Promise<void>;
	verify: () => void;
}

// Define the BackendTokens type


export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserContextProviderProps {
	children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
	const { toastSuccess } = useToast();
	const [authenticated, setAuthenticated] = useState<boolean>(
		Cookies.get("authenticated") === "true" || false
	);

	const [user, setUser] = useState<User | null>(null);
	const [ready, setReady] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (Cookies.get("authenticated") === undefined) {
			Cookies.set("authenticated", "false");
		}
	}, []);

	const fetchUser = async () => {
		try {
			const { data } = await instance.get("/api/auth/user");
			if (data.status === 200) {
				setUser(data.data);
			}
			else {
				setUser(null);
				setAuthenticated(false);
			}
			setError(null);
		}
		catch (e) {
			console.error(e);
			setError("Failed to fetch user data");
		}
		finally {
			setReady(true);
		}
	};

	const refreshAccessToken = async () => {
		try {
			const { data } = await instance.get("/api/auth/refresh");
			if (data.status === 200) {
				Cookies.set("accessToken", data.data.token, {
					secure: true,
					sameSite: "Strict",
					expires: new Date(Date.now() + data.data.expiresIn * 1000),
				});
				Cookies.set("authenticated", "true", { expires: 7 }); // Set cookie to expire in 7 days
				setUser(data.data.user);
				await fetchUser();
			} else {
				setError("Failed to refresh access token");
				logout();
			}
		} catch (error) {
			console.error(error);
			setError("Failed to refresh access token");
			logout();
		}
	};

	useEffect(() => {
		const initializeUser = async () => {
			if (authenticated) {
				try {
					await fetchUser();
					if (user === null) {
						await refreshAccessToken();
					}
				} catch (error) {
					console.error(error);
					setError("Failed to initialize user data");
				} finally {
					setReady(true);
				}
			} else {
				setReady(true);
			}
		};

		initializeUser();

		// Set up the refreshAccessTokenInterval only when authenticated
		let refreshAccessTokenInterval: NodeJS.Timeout;
		if (authenticated) {
			refreshAccessTokenInterval = setInterval(
				refreshAccessToken,
				50 * 1000
				// 5 * 60 * 60 * 1000
				// 10*1000
			);
		}

		// Clean up the interval when the component unmounts or when user is not authenticated
		return () => {
			clearInterval(refreshAccessTokenInterval);
		};
	}, [authenticated]);

	const login = (data: BackendTokens) => {
		console.log(data);
		setUser(data.user);
		setAuthenticated(true);
		Cookies.set("accessToken", data.token, {
			secure: true,
			sameSite: "Strict",
			expires: new Date(Date.now() + data.expiresIn * 1000),
		});
		Cookies.set("refreshAccessToken", data.refreshToken);
		Cookies.set("authenticated", "true", { expires: 7 }); // Set cookie to expire in 7 days
	};

	const verify = () => {
		if (user) {
			setUser({ ...user, verified: true });
		}
		fetchUser();
	};

	const logout = async () => {
		try {
			const config = {
				method: "POST",
				maxBodyLength: Infinity,
				url: "/api/auth/logout",
				headers: {},
			};
			await instance.request(config);
		} catch (error) {
			console.log(error);
		}
		setAuthenticated(false);
		setUser(null);
		Cookies.remove("token");
		Cookies.remove("accessToken");
		Cookies.remove("refreshToken");
		Cookies.set("authenticated", "false");
		Cookies.remove("refreshAccessToken");
		toastSuccess("Logged out successfully", 5000);
	};

	return (
		<UserContext.Provider
			value={{
				user,
				setUser,
				ready,
				setReady,
				error,
				authenticated,
				login,
				logout,
				verify,
			}}
		>
			{children}
		</UserContext.Provider>
	);
}

// Helper hook to use the UserContext
export const useUserContext = (): UserContextType => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext must be used within a UserContextProvider");
	}
	return context;
};
