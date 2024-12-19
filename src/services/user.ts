import { db } from "@/firebase/store";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

export async function getFavoriteTickets(userId: any) {
  try {
      if (!userId) {
          throw new Error("User ID is required");
      }

      // Tham chiếu đến document trong collection `users`
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          // Lấy dữ liệu từ document
          const userData = userDoc.data();
          return userData.favoriteTickets || [];
      } else {
          throw new Error("User not found");
      }
  } catch (error: any) {
      console.error("Error fetching favorite tickets:", error.message);
      throw error;
  }
}

export async function addTicketToFavorites(userId: any, ticketId: any) {
  try {
      if (!userId || !ticketId) {
          throw new Error("Both userId and ticketId are required");
      }

      // Tham chiếu đến document trong collection `users`
      const userDocRef = doc(db, "users", userId);

      // Cập nhật mảng `favoriteTickets` bằng cách thêm `ticketId` (không thêm trùng lặp)
      await updateDoc(userDocRef, {
          favoriteTickets: arrayUnion(ticketId),
      });

      console.log(`Ticket ID "${ticketId}" added to favorites for user "${userId}".`);
  } catch (error: any) {
      console.error("Error adding ticket to favorites:", error.message);
      throw error;
  }
}

export async function removeTicketFromFavorites(userId: any, ticketId: any) {
  try {
      if (!userId || !ticketId) {
          throw new Error("Both userId and ticketId are required");
      }

      // Tham chiếu đến document trong collection `users`
      const userDocRef = doc(db, "users", userId);

      // Cập nhật mảng `favoriteTickets` bằng cách xóa `ticketId`
      await updateDoc(userDocRef, {
          favoriteTickets: arrayRemove(ticketId),
      });

      console.log(`Ticket ID "${ticketId}" removed from favorites for user "${userId}".`);
  } catch (error: any) {
      console.error("Error removing ticket from favorites:", error.message);
      throw error;
  }
}

export const getUsers = async () => {
    try {
      // Truy vấn tất cả các document trong collection 'users'
      const usersCollection = collection(db, "users");
      const querySnapshot = await getDocs(usersCollection);
  
      // Map qua các document để lấy dữ liệu và ID
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id, // ID của document
        ...doc.data(), // Dữ liệu của document
      }));
  
      return users;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      return [];
    }
};

export async function deleteUserById(userId: any) {
    try {
      // Tạo tham chiếu đến document trong collection users
      const userDocRef = doc(db, 'users', userId);
  
      // Xóa document
      await deleteDoc(userDocRef);
      console.log('Document successfully deleted!');
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }
  
  
