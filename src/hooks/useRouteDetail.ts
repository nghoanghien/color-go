import { getDetailRoute } from "@/services/routes";
import { useEffect, useState } from "react";

export function useRouteDetail(id: string) {
  const [route, setRoute] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getDetailRoute(id);
      setRoute(data);
      setIsLoading(false);
    })()
  }, [id]);

  return [isLoading, route];
}