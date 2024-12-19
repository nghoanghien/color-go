import { db } from "@/firebase/store";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

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

export async function addCoachCompany(info: any) {
  try {
    // Tạo truy vấn để kiểm tra nếu document với name đã tồn tại
    const q = query(collection(db, 'coachCompanies'), where('name', '==', info.name));
    const querySnapshot = await getDocs(q);
    
    // Nếu tìm thấy document trùng lặp, thông báo lỗi
    if (!querySnapshot.empty) {
      throw new Error(`Nhà xe với tên "${info.name}" đã tồn tại.`);
      return;
    }
    // Nếu không tìm thấy trùng lặp, thêm document mới
    const docRef = await addDoc(collection(db, 'coachCompanies'), {
      facility: info.facility,
      name: info.name,
      numberSeat: info.numberSeat,
      type: info.type
    });

    return docRef.id;

    console.log('Document successfully added with ID: ', docRef.id);
  } catch (error) {
    // Re-throw lỗi để xử lý bên ngoài
    throw error;
  }
}

export async function deleteCoachCompanyById(coachCompanyId: any) {
  try {
    // Tạo tham chiếu đến document trong collection coachCompanies
    const coachCompanyDocRef = doc(db, 'coachCompanies', coachCompanyId);

    // Lấy dữ liệu nhà xe từ Firestore
    const coachCompanySnapshot = await getDoc(coachCompanyDocRef);

    if (!coachCompanySnapshot.exists()) {
      throw new Error('Coach company not found');
    }

    const coachCompanyData = coachCompanySnapshot.data();
    const coachCompanyName = coachCompanyData.name;

    if (!coachCompanyName) {
      throw new Error('Coach company name is missing');
    }

    // Lấy thời gian hiện tại
    const currentTime = new Date();

    // Tìm các chuyến chưa khởi hành trong collection routes
    const routesCollectionRef = collection(db, 'routes');
    const routesQuery = query(
      routesCollectionRef,
      where('name', '==', coachCompanyName),
      where('departureTime', '>', currentTime)
    );

    const routesSnapshot = await getDocs(routesQuery);

    if (!routesSnapshot.empty) {
      throw new Error(`Nhà xe ${coachCompanyName} vẫn còn chuyến chưa khởi hành.`);
    }

    // Xóa document của nhà xe
    await deleteDoc(coachCompanyDocRef);
    console.log('Coach company successfully deleted!');
  } catch (error) {
    console.error('Error deleting coach company: ', error);
    throw error; // Re-throw error để xử lý bên ngoài (nếu cần)
  }
}


