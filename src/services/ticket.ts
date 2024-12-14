import { db } from "@/firebase/store";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

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