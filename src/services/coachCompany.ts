import { db } from "@/firebase/store";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function getCoachDetail(name: string) {
  const q = query(
    collection(db, "coachCompanies"),
    where("name", "==", name),
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));

  return data.at(0);
}

export const fetchCoachCompanies = async () => {
  const coachCollection = collection(db, 'coachCompanies');
  const coachSnapshot = await getDocs(coachCollection);
  const coachList = coachSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return coachList;
};

export async function updateCoachCompany(info: any) {
  try {
    // Tạo query để tìm kiếm document có name trùng với name trong object đầu vào
    const q = query(collection(db, 'coachCompanies'), where('name', '==', info.name));

    // Thực hiện truy vấn
    const querySnapshot = await getDocs(q);

    // Kiểm tra nếu tìm thấy document
    if (!querySnapshot.empty) {
      // Lấy document đầu tiên tìm thấy (nếu có nhiều document trùng tên, ta chỉ sửa document đầu tiên)
      const docRef = querySnapshot.docs[0].ref;

      // Cập nhật thông tin mới
      await updateDoc(docRef, {
        facility: info.facility,
        numberSeat: info.numberSeat,
        type: info.type
      });

      console.log('Document successfully updated!');
    } else {
      console.log('No document found with the specified name.');
    }
  } catch (error) {
    console.error('Error updating document: ', error);
  }
}

