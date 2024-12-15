import { db } from "../firebase/store";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export const getRouteNames = async (
  type: "departure" | "arrival" = "departure"
) => {
  const routesCollection = collection(db, "routes");
  const routesSnapshot = await getDocs(routesCollection);
  const routesData = routesSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Group routes by departure location.
  const groupedRoutes = routesData.reduce<Record<string, string[]>>(
    (acc, route: any) => {
      const location = (
        type === "departure" ? route.departureLocation : route.arrivalLocation
      ) as string;
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(route);
      return acc;
    },
    {}
  );

  return groupedRoutes;
};

export const getRouteList = async (from: string, to: string, date: Date) => {
  const q = query(
    collection(db, "routes"),
    where("departureLocation", "==", from),
    where("arrivalLocation", "==", to),
    where("departureTime", ">", Timestamp.fromDate(new Date(date.setHours(0, 0, 0, 0)))),
    where("departureTime", "<", Timestamp.fromDate(new Date(date.setHours(23, 59, 59, 999)))),
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));

  return data;
};

export const getDetailRoute = async (id: string) => {
  const docRef = doc(db, "routes", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    throw new Error("Can not find route");
  }
};

export const getPromotions = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "promotions"));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching promotions:", error);
        return [];
    }
  };
  