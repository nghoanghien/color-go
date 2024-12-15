import { db } from "@/firebase/store";
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";

export async function getMembershipById(userId: any) {
    const userDocRef = doc(db, "users", userId); // Đường dẫn đến document của người dùng

    try {
        const userDoc = await getDoc(userDocRef); // Lấy dữ liệu từ Firestore
        
        if (userDoc.exists()) {
            const userData = userDoc.data(); // Lấy dữ liệu của người dùng
            return userData.membership || null; // Trả về membership nếu tồn tại
        } else {
            console.error("No such user with the given ID!");
            return null;
        }
    } catch (error: any) {
        console.error("Error fetching membership:", error);
        return null;
    }
}

export async function updateMembershipById(userId: any, historyItem: any) {
  const userDocRef = doc(db, "users", userId); // Đường dẫn đến document của người dùng

  try {
      const userDoc = await getDoc(userDocRef); // Lấy dữ liệu hiện tại từ Firestore

      if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentMembership = userData.membership || { point: 0, history: [] };

          const updatedMembership = {
              point: currentMembership.point + (historyItem.point || 0), // Cộng điểm
              history: [...userDoc.data().membership.history, {
                  point: historyItem.point || 0,
                  title: historyItem.title || "",
                  datetime: historyItem.datetime || new Date().toISOString()
              }] // Thêm history mới vào mảng
          };

          await updateDoc(userDocRef, {
              membership: updatedMembership
          });

          console.log("Membership updated successfully!");
      } else {
          console.error("No such user with the given ID!");
      }
  } catch (error: any) {
      console.error("Error updating membership:", error);
  }
}

export function getLevelByPoint(point: any) {
  if (point <= 199) {
      return "bronze";
  } else if (point >= 200 && point <= 399) {
      return "silver";
  } else if (point >= 400 && point <= 599) {
      return "gold";
  } else if (point >= 600 && point <= 799) {
      return "diamond";
  } else {
      return "Invalid point";
  }
}

export function pointsToNextLevel(point: any) {
  if (point <= 199) {
      return 200 - point; // Điểm cần để lên "silver"
  } else if (point >= 200 && point <= 399) {
      return 400 - point; // Điểm cần để lên "gold"
  } else if (point >= 400 && point <= 599) {
      return 600 - point; // Điểm cần để lên "diamond"
  } else if (point >= 600 && point <= 799) {
      return 800 - point; // Điểm cần để hoàn thành
  } else {
      return "Already at max level or invalid point";
  }
}

export async function changeMembershipById(userId: any, title: string, point: any) {
  const historyItem = {
      point: point, // Số điểm cần thay đổi
      title: title, // Tiêu đề của sự kiện thay đổi
      datetime: new Date().toISOString() // Thời gian hiện tại
  };
  console.log({historyItem, point})

  try {
      await updateMembershipById(userId, historyItem);
      console.log("Membership change completed successfully!");
  } catch (error: any) {
      console.error("Error changing membership:", error);
  }
}






