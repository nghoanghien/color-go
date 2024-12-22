"use client";

import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	const adminUserString = localStorage.getItem("admin-user");

	if (adminUserString) {
		const adminUser = JSON.parse(adminUserString);

		return <>{children}</>;
	} else {
		redirect("/admin/admin-login");
	}
}
