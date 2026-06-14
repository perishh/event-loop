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
