import { db } from "@/firebase/store";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

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
