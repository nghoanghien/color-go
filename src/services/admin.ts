import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "@/firebase/store";

export const fetchAdminData = async () => {
	const adminCollection = collection(db, "admin");
	const adminSnapshot = await getDocs(adminCollection);
	const adminList = adminSnapshot.docs.map((doc) => ({
		id: doc.id,
		...doc.data(),
	}));
	return adminList;
};

export const updateAdminInfo = async (data: any) => {
	const { email, ...updateData } = data;

	if (!email) {
		throw new Error("Email không được bỏ trống.");
	}

	// Tạo query để tìm document theo email
	const q = query(collection(db, "admin"), where("email", "==", email));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		console.log(`Không tìm thấy admin có email: ${email}`);
		return;
	}

	// Duyệt qua các documents tìm được và cập nhật
	for (const document of querySnapshot.docs) {
		const docRef = doc(db, "admin", document.id); // Lấy reference đến doc cần update
		await updateDoc(docRef, updateData);
		console.log(`Đã cập nhật thông tin cho doc ID: ${document.id}`);
	}
};

export const getDetailAdmin = async (id: string) => {
	const adminSnapshot = await getDoc(doc(db, "admin", id));

	return {
		...adminSnapshot.data(),
		id: adminSnapshot.id,
	};
};
