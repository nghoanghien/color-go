import { db } from "@/firebase/store";
import { collection, getDocs, query, where } from "firebase/firestore";

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
