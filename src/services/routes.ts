import { db } from '../firebase/store';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const getRouteNames = async (type: 'departure' | 'arrival' = 'departure') => {
    const routesCollection = collection(db, 'routes');
    const routesSnapshot = await getDocs(routesCollection);
    const routesData = routesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Group routes by departure location. 
    const groupedRoutes = routesData.reduce<Record<string, string[]>>((acc, route: any) => {
        const location = (type === 'departure' ? route.departureLocation : route.arrivalLocation) as string;
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(route);
        return acc;
    }, {});

    return groupedRoutes;
};

export const getRouteList = async (from: string, to: string, date: Date) => {
    const q = query(collection(db, "routes"), where("departureLocation", "==", from), where("arrivalLocation", "==", to));

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map(d => d.data());

    return data;

}
