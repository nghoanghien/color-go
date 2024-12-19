import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebase/store";

export const fetchAdminData = async () => {
  const adminCollection = collection(db, 'admin');
  const adminSnapshot = await getDocs(adminCollection);
  const adminList = adminSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return adminList;
};
