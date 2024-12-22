import { convertDatetimeLocalToFirestoreTimestamp } from "@/utils/time-manipulation";
import { db } from "../firebase/store";
import {
  addDoc,
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
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

// Hàm xóa hoàn lại ghế khi thực hiện hủy vé
export async function removeBookedSeats(routeId: any, seatsToRemove: any) {
  try {
    const routeRef = doc(db, "routes", routeId);
    // Xóa từng ghế trong mảng seatsToRemove khỏi bookedSeats
    const updates = seatsToRemove.map((seat: any) => {
      updateDoc(routeRef, {
        bookedSeats: arrayRemove(seat),
      })
    });

    console.log("Done")
    // Đợi tất cả các promises hoàn thành
    await Promise.all(updates);

    console.log(`Successfully removed seats: ${seatsToRemove.join(", ")}`);
  } catch (error: any) {
    console.error("Error removing seats: ", error);
  }
}

export const fetchRoute = async () => {
  const routeCollection = collection(db, 'routes');
  const routeSnapshot = await getDocs(routeCollection);
  const routeList = routeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return routeList;
};

export async function deleteRoute(routeId: any) {
  try {
    // Tạo tham chiếu đến document trong collection routes
    const routeDocRef = doc(db, 'routes', routeId);

    // Lấy document để kiểm tra dữ liệu
    const routeDoc = await getDoc(routeDocRef);

    if (!routeDoc.exists()) {
      throw new Error('Route not found');
    }

    const routeData = routeDoc.data();

    // Kiểm tra nếu mảng bookedSeats không rỗng
    if (routeData.bookedSeats && routeData.bookedSeats.length > 0) {
      throw new Error('Chuyến xe này đã có người đặt vé');
    }

    // Xóa document nếu kiểm tra hợp lệ
    await deleteDoc(routeDocRef);
    console.log('Route successfully deleted!');
  } catch (error) {
    console.error('Error deleting route: ', error);
    throw error;
  }
}

export async function addRoute(route: any) {
  try {
    const { arrivalTime, departureTime, stops } = route;

    const now = new Date();
    if (departureTime <= convertDatetimeLocalToFirestoreTimestamp(now)) {
      throw new Error('Giờ khởi hành phải lớn hơn giờ hiện tại.');
    }

    if (route.departureLocation === route.arrivalLocation) {
      throw new Error('Điểm khởi hành và điểm đến phải khác nhau.');
    }

    // Kiểm tra giờ đến và giờ khởi hành
    if (arrivalTime <= departureTime) {
      throw new Error('Giờ đến phải lớn hơn giờ khởi hành.');
    }

    // Kiểm tra các điểm dừng
    for (const stop of stops) {
      if (stop.datetime < departureTime || stop.datetime > arrivalTime) {
        throw new Error(`Giờ đến"${stop.stop}" phải trong hành trình của chuyến.`);
      }
    }

    // Thêm thuộc tính totalSeat và bookedSeats nếu chưa tồn tại
    const newRoute = {
      ...route,
      totalSeat: 36,
      bookedSeats: []
    };

    // Tạo tham chiếu đến collection routes
    const routesCollectionRef = collection(db, 'routes');

    // Thêm document mới vào collection
    const docRef = await addDoc(routesCollectionRef, newRoute);

    console.log('Route successfully added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding route: ', error);
    throw error;
  }
}
  
export async function updateRoute(route: any) {
  try {
    const { id, arrivalTime, departureTime, stops } = route;

    // Tạo tham chiếu đến document cần cập nhật trong collection routes
    const routeDocRef = doc(db, 'routes', id);

    // Lấy document để kiểm tra dữ liệu
    const routeDoc = await getDoc(routeDocRef);

    if (!routeDoc.exists()) {
      throw new Error('Route not found');
    }

    const routeData = routeDoc.data();

    // Kiểm tra nếu mảng bookedSeats không rỗng
    if (routeData.bookedSeats && routeData.bookedSeats.length > 0) {
      throw new Error('Chuyến xe này đã có người đặt vé');
    }

    if (route.departureLocation === route.arrivalLocation) {
      throw new Error('Điểm khởi hành và điểm đến phải khác nhau.');
    }

    // Kiểm tra giờ đến và giờ khởi hành
    if (arrivalTime <= departureTime) {
      throw new Error('Giờ đến phải lớn hơn giờ khởi hành.');
    }

    // Kiểm tra các điểm dừng
    for (const stop of stops) {
      if (stop.datetime < departureTime || stop.datetime > arrivalTime) {
        throw new Error(`Giờ đến "${stop.stop}" phải trong hành trình của chuyến.`);
      }
    }

    // Xóa id trước khi cập nhật vì Firestore không cần lưu id trong document
    const { id: routeId, ...routeDataToUpdate } = route;

    // Cập nhật document với dữ liệu mới
    await updateDoc(routeDocRef, routeDataToUpdate);
    console.log('Route successfully updated!');
  } catch (error) {
    console.error('Error updating route: ', error);
    throw error;
  }
}

export function filterAvailableUpcomingTickets(tickets: any) {
  const now = new Date();

  // Lọc các ticket có departureTime lớn hơn thời gian hiện tại và còn chỗ
  const availableUpcomingTickets = tickets.filter((ticket: any) => {
    const isUpcoming = ticket.departureTime.toDate() > now;
    const hasAvailableSeats = ticket.totalSeat - ticket.bookedSeats.length > 0;
    return isUpcoming && hasAvailableSeats;
  });

  return availableUpcomingTickets;
}
