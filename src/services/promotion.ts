import { getDocs } from "firebase/firestore";
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
