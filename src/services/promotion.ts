import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/store";
import { collection, query, where } from "firebase/firestore";

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
    // Tạo tham chiếu đến collection promotions
    const promotionsCollectionRef = collection(db, 'promotions');

    // Thêm document mới vào collection
    const docRef = await addDoc(promotionsCollectionRef, promotion);

    console.log('Promotion successfully added with ID: ', docRef.id);
    return docRef.id;
  } catch (error: any) {
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

