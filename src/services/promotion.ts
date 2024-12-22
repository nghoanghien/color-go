import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/store";
import { collection, query, where } from "firebase/firestore";
import { convertDatetimeLocalToFirestoreTimestamp } from "@/utils/time-manipulation";

export async function getPromotionList() {
  const q = query(
    collection(db, "promotions"));

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));

  return data;
}

export const fetchPromotion = async () => {
  const promotionCollection = collection(db, 'promotions');
  const promotionSnapshot = await getDocs(promotionCollection);
  const promotionList = promotionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return promotionList;
};

export async function updatePromotion(promotion: any) {
  try {

    if (promotion.type === 0 && promotion.max !== promotion.value) {
      throw new Error('Giảm tối đa phải bằng giá trị giảm cho giảm tiền cố định.');
    }
    // Tạo tham chiếu đến document cần cập nhật trong collection promotions
    const promotionDocRef = doc(db, 'promotions', promotion.id);

    // Xóa id trước khi cập nhật vì Firestore không cần lưu id trong document
    const { id, ...promotionData } = promotion;

    // Cập nhật document với dữ liệu mới
    await updateDoc(promotionDocRef, promotionData);
    console.log('Promotion successfully updated!');
  } catch (error: any) {
    console.error('Error updating promotion: ', error);
    throw error;
  }
}

export async function addPromotion(promotion: any) {
  try {

    const now = new Date();
    if(promotion.valid <= convertDatetimeLocalToFirestoreTimestamp(now)) {
      throw new Error(`Hạn sử dụng của mã "${promotion.code}" phải lớn hơn thời gian hiện tại.`);
    }

    // Tạo tham chiếu đến collection promotions
    const promotionsCollectionRef = collection(db, 'promotions');

    // Lấy tất cả các documents trong collection promotions
    const querySnapshot = await getDocs(promotionsCollectionRef);

    // Kiểm tra trùng mã code
    querySnapshot.forEach((doc) => {
      if (doc.data().code === promotion.code) {
        throw new Error(`Mã "${promotion.code}" đã tồn tại.`);
      }
    });

    // Kiểm tra giá trị max nếu type là 0
    if (promotion.type === 0 && promotion.max !== promotion.value) {
      throw new Error('Giảm tối đa phải bằng giá trị giảm cho giảm tiền cố định.');
    }

    // Thêm document mới vào collection
    const docRef = await addDoc(promotionsCollectionRef, promotion);

    console.log('Promotion successfully added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding promotion: ', error);
    throw error;
  }
}


export async function deletePromotion(promotionId: any) {
  try {
    // Tạo tham chiếu đến document cần xóa trong collection promotions
    const promotionDocRef = doc(db, 'promotions', promotionId);

    // Xóa document
    await deleteDoc(promotionDocRef);
    console.log('Promotion successfully deleted!');
  } catch (error) {
    console.error('Error deleting promotion: ', error);
    throw error;
  }
}

