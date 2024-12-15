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
              history: arrayUnion({
                  point: historyItem.point || 0,
                  title: historyItem.title || "",
                  datetime: historyItem.datetime || new Date().toISOString()
              }) // Thêm history mới vào mảng
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
  if (point >= 0 && point <= 199) {
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





