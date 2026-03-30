import { useQuery } from "@tanstack/react-query";
import type { Course } from "../backend.d";
import { useActor } from "./useActor";

export function useAllCourses() {
  const { actor, isFetching: isActorFetching } = useActor();
  const query = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isActorFetching,
  });
  return {
    ...query,
    isLoading: query.isLoading || isActorFetching,
  };
}
