export function useAdminUser() {
	const adminUserString = localStorage.getItem("admin-user");

	if (adminUserString) {
		try {
			return JSON.parse(adminUserString);
		} catch (error) {
			console.log("Error parse adminUser: ", error);
			return null;
		}
	} else {
		return null;
	}
}
