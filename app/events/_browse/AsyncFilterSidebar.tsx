import prisma from "@/lib/prisma";
import { ResolvedParams } from "../types";
import FilterSidebar from "./FilterSidebar";

export default async function AsyncFilterSidebar({
  params,
}: {
  params: ResolvedParams;
}) {
  const cities = (
    await prisma.event.groupBy({
      by: ["city"],
      orderBy: { city: "asc" },
    })
  ).map((group) => group.city);

  return <FilterSidebar cities={cities} params={params} />;
}
