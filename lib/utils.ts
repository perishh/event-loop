export const formatDate = (date: Date) =>
  date.toLocaleDateString("el-GR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatTime = (date: Date) =>
  date.toLocaleTimeString("el-GR", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const cleanParams = (
  obj: Record<string, unknown>,
): Record<string, string> => {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value === null || value === undefined || value === "[]") {
        return acc;
      }

      acc[key] = String(value);
      return acc;
    },
    {} as Record<string, string>,
  );
};
