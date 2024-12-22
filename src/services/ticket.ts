import { db } from "@/firebase/store";
import { convertDatetimeLocalToFirestoreTimestamp } from "@/utils/time-manipulation";
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc, } from "firebase/firestore";

export async function createTicket(userId: string, ticket: any) {
  const routeId = ticket.routeId;

  await addTicketToUser(userId, ticket);
  await addSeatToRoute(routeId, ticket.seats);
}

async function addTicketToUser(userId: string, ticket: any) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    tickets: arrayUnion(ticket),
  });
}

async function addSeatToRoute(routeId: string, seats: string[]) {
  const docRef = doc(db, "routes", routeId);
  await updateDoc(docRef, {
    bookedSeats: arrayUnion(...seats),
  });
}

export async function getTicketsFromIds(ticketIds: any) {
  try {

      const tickets = [];

      for (const ticketId of ticketIds) {
          // Tham chiếu đến từng document trong collection `tickets`
          const ticketDocRef = doc(db, "routes", ticketId.toString());
          const ticketDoc = await getDoc(ticketDocRef);

          if (ticketDoc.exists()) {
              tickets.push({ id: ticketId, ...ticketDoc.data() });
          } else {
              console.warn(`Ticket with ID "${ticketId}" does not exist.`);
          }
      }

      return tickets;
  } catch (error: any) {
      console.error("Error fetching tickets:", error.message);
      throw error;
  }
}

export async function updateTicketStatus(userId: string, ticketId: string) {
  try {
    // Lấy tài liệu người dùng từ Firestore
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();

    if (!userData) return;
    
    // Kiểm tra nếu mảng tickets tồn tại trong dữ liệu của người dùng
    if (!userData.tickets || !Array.isArray(userData.tickets)) {
      throw new Error('Tickets array not found');
    }

    // Tìm ticket trong mảng tickets có id là ticketId
    const ticketIndex = userData.tickets.findIndex((ticket: any) => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
      throw new Error('Ticket not found');
    }

    // Cập nhật status của ticket
    userData.tickets[ticketIndex].status = 0;
    
    // Lưu lại thay đổi vào Firestore
    updateDoc(userRef, {
      tickets: userData.tickets
    });

    console.log('Ticket status updated successfully');
  } catch (error: any) {
    console.error('Error updating ticket status:', error);
  }
}

export async function getTickets(userId: any) {
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
          return userData.tickets || [];
      } else {
          throw new Error("User not found");
      }
  } catch (error: any) {
      console.error("Error fetching favorite tickets:", error.message);
      throw error;
  }
}

export async function getAllTicketsWithUserId() {
  try {
    // Tạo tham chiếu đến collection users
    const usersCollectionRef = collection(db, 'users');

    // Lấy tất cả document trong collection users
    const usersSnapshot = await getDocs(usersCollectionRef);

    const ticketsWithUserIds: any[] = [];

    // Duyệt qua tất cả các document
    usersSnapshot.forEach(userDoc => {
      const userData = userDoc.data();
      const userId = userDoc.id;

      // Kiểm tra nếu user có tickets
      if (userData.tickets && Array.isArray(userData.tickets)) {
        // Thêm id của user vào mỗi ticket
        const ticketsWithId = userData.tickets.map(ticket => ({
          ...ticket,
          userId
        }));

        // Nối vào mảng kết quả
        ticketsWithUserIds.push(...ticketsWithId);
      }
    });

    return ticketsWithUserIds;
  } catch (error) {
    console.error('Error fetching tickets: ', error);
    throw error;
  }
}

export function isValidForCancel(ticket: any) {
  const now = new Date();

  // Thời gian hiện tại cộng thêm 4 tiếng
  const fourHoursFromNow = new Date(now.getTime() + 4 * 60 * 60 * 1000);

  // Kiểm tra thời gian khởi hành của ticket có lớn hơn thời gian hiện tại cộng 4 tiếng
  return ticket.originalDepartureTime > convertDatetimeLocalToFirestoreTimestamp(fourHoursFromNow);
}
