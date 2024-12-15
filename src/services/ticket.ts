import { db } from "@/firebase/store";
import { ref } from "firebase/database";
import { arrayUnion, doc, getDoc, updateDoc,  } from "firebase/firestore";

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

async function updateTicketStatus(userId: any, ticketId: any) {
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

