export function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(date) + " UTC";
  } catch (e) {
    return dateString;
  }
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'healthy':
      return "text-green-500";
    case 'warning':
      return "text-yellow-500";
    case 'critical':
      return "text-red-500";
    default:
      return "text-gray-400";
  }
}

export function getStatusBgColor(status: string) {
  switch (status.toLowerCase()) {
    case 'healthy':
      return "bg-green-500/10 border-green-500/20";
    case 'warning':
      return "bg-yellow-500/10 border-yellow-500/20";
    case 'critical':
      return "bg-red-500/10 border-red-500/20";
    default:
      return "bg-gray-500/10 border-gray-500/20";
  }
}
