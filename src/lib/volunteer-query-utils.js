export const QUERY_SUBJECT_LIMIT = 150;
export const QUERY_MESSAGE_LIMIT = 3000;

export function validateVolunteerQuery(subject, message) {
  const errors = {};
  if (!subject.trim()) errors.subject = "Enter a subject for your query.";
  else if (subject.trim().length > QUERY_SUBJECT_LIMIT) errors.subject = "The subject must be 150 characters or fewer.";
  if (!message.trim()) errors.message = "Enter your message.";
  else if (message.trim().length > QUERY_MESSAGE_LIMIT) errors.message = "The message must be 3,000 characters or fewer.";
  return errors;
}

export function queryDateTime(value) {
  if (!value) return "Not available";
  const timestamp = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Dhaka",
  }).format(date);
}

export function queryFilters(params = {}) {
  const page = Number(params.page);
  return {
    page: String(Number.isSafeInteger(page) && page > 0 ? page : 1),
    pageSize: "10",
    search: typeof params.search === "string" ? params.search.trim().slice(0, 100) : "",
    ...(params.status === "seen" ? { isSeen: "true" } : params.status === "unseen" ? { isSeen: "false" } : {}),
  };
}
