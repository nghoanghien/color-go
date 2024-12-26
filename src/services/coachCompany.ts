import { db } from "@/firebase/store";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FaRegCaretSquareLeft } from "react-icons/fa";

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
    const q = query(collection(db, "coachCompanies"));
    const querySnapshot = await getDocs(q);

    // Lọc kết quả không phân biệt hoa thường
    const results = querySnapshot.docs.filter(
      (doc) =>
        doc.data().name.trim().toLowerCase() === info.name.trim().toLowerCase()
    );

    
    // Nếu tìm thấy document trùng lặp, thông báo lỗi
    if (results.length > 0) {
      throw new Error(`Nhà xe với tên "${results[0].data().name}" đã tồn tại.`);
      return;
    }
    // Nếu không tìm thấy trùng lặp, thêm document mới
    const docRef = await addDoc(collection(db, 'coachCompanies'), {
      facility: info.facility,
      name: info.name,
      numberSeat: info.numberSeat,
      type: info.type
    });

    console.log('Document successfully added with ID: ', docRef.id);
    return docRef.id;

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
      throw new Error('Không tìm thấy nhà xe. Tải lại trang để cập nhật dữ liệu mới nhất nhé.');
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


