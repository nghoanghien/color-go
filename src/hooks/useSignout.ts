import { useCallback } from "react";

export function useSignout() {
	const handleSignout = useCallback(() => {
		localStorage.removeItem("admin-user");
	}, []);

	return handleSignout;
}
