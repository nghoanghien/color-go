"use client";

import { redirect } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, [])

	if (!isClient) return <></>

	const adminUserString = localStorage.getItem("admin-user");

	if (adminUserString) {
		const adminUser = JSON.parse(adminUserString);

		return <>{children}</>;
	} else {
		redirect("/admin/admin-login");
	}
}
