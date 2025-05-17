export function formatMessageTime(date) {
  const messageDate = new Date(date);
  const now = new Date();
  
  // Format time
  const time = messageDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  
  // If message is from today, just show time
  if (messageDate.toDateString() === now.toDateString()) {
    return time;
  }
  
  // If message is from yesterday, show "Yesterday"
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${time}`;
  }
  
  // If message is from this year, show date without year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }) + ` at ${time}`;
  }
  
  // For older messages, show full date
  return messageDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }) + ` at ${time}`;
}