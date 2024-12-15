import { db } from "@/firebase/store";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

export async function getUserWallet(userId: any) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const userRef = doc(db, "users", userId); // Tham chiếu đến document của người dùng

  try {
    const userSnap = await getDoc(userRef); // Lấy document của người dùng

    if (userSnap.exists()) {
      const userData = userSnap.data(); // Lấy dữ liệu của người dùng
      const wallet = userData.wallet || {}; // Lấy thông tin ví, mặc định là object rỗng

      return {
        balance: wallet.balance ?? 0, // Trả về balance, mặc định là 0
        history: wallet.history ?? [], // Trả về history, mặc định là mảng rỗng
      };
    } else {
      throw new Error(`User with ID "${userId}" does not exist.`);
    }
  } catch (error) {
    console.error("Error fetching user wallet:", error);
    throw error; 
  }
}


export async function updateUserWallet(userId: any, historyItem: any) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (
    !historyItem ||
    typeof historyItem !== "object" ||
    !historyItem.title ||
    !historyItem.datetime ||
    typeof historyItem.fluctuation !== "number"
  ) {
    throw new Error(
      "History item must be an object with 'title', 'datetime', and 'fluctuation'."
    );
  }

  const userRef = doc(db, "users", userId); // Tham chiếu đến document của người dùng

  try {
    const userSnap = await getDoc(userRef); // Lấy document của người dùng

    if (userSnap.exists()) {
      const userData = userSnap.data(); // Lấy dữ liệu người dùng

      const newBalance = (userData.wallet?.balance ?? 0) + historyItem.fluctuation;

      await updateDoc(userRef, {
        "wallet.balance": newBalance, // Cập nhật balance
        "wallet.history": [...(userData.wallet?.history || []), historyItem], // Thêm vào history
      });

      console.log(`User ${userId} wallet updated successfully.`);
      return { newBalance, historyItem };
    } else {
      throw new Error(`User with ID "${userId}" does not exist.`);
    }
  } catch (error: any) {
    console.error("Error updating user wallet:", error);
    throw error; // Ném lỗi để xử lý bên ngoài
  }
}

export async function adjustUserBalance(id: string, title: string, amount: number): Promise<void> {
  if (!id) {
    throw new Error("User ID is required.");
  }

  if (!title || typeof title !== "string") {
    throw new Error("Title must be a non-empty string.");
  }

  if (typeof amount !== "number") {
    throw new Error("Amount must be a number.");
  }

  // Tạo một object historyItem
  const historyItem = {
    title,
    datetime: new Date().toISOString(), // Lấy thời gian hiện tại theo định dạng ISO
    fluctuation: amount, // Giá trị thay đổi
  };

  try {
    // Sử dụng hàm updateUserWallet để cập nhật
    const result = await updateUserWallet(id, historyItem);
    console.log("Wallet updated:", result);
  } catch (error) {
    console.error("Failed to adjust user balance:", error);
    throw error;
  }
}

