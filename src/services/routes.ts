import { db } from '../firebase/store';
import { collection, getDocs } from 'firebase/firestore';

export const getRouteNames = async () => {
    const routesCollection = collection(db, 'routes'); 
    const routesSnapshot = await getDocs(routesCollection);
    const routesData = routesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Group routes by departure location. 
    const groupedRoutes = routesData.reduce<Record<string, string[]>>((acc, route: any) => {
        const location = route.departureLocation as string;
        if (!acc[location]) {
            acc[location] = [];
        }
        acc[location].push(route);
        return acc;
    }, {});

    return groupedRoutes;
};
