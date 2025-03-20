/**
 * Helper functions for date-time handling in Indian Standard Time (IST)
 */

// Format a date to YYYY-MM-DD format in Indian timezone
const formatDate = (date) => {
  const options = { timeZone: 'Asia/Kolkata' };
  const dateObj = date ? new Date(date) : new Date();
  const year = dateObj.toLocaleString('en-US', { year: 'numeric', ...options });
  const month = dateObj.toLocaleString('en-US', { month: '2-digit', ...options });
  const day = dateObj.toLocaleString('en-US', { day: '2-digit', ...options });
  return `${year}-${month}-${day}`;
};

// Get current date in YYYY-MM-DD format in Indian timezone
const getCurrentIndianDate = () => {
  return formatDate(new Date());
};

// Format datetime to MySQL datetime format in Indian timezone
const formatMySQLDateTime = (date) => {
  const options = { timeZone: 'Asia/Kolkata' };
  const dateObj = date ? new Date(date) : new Date();
  
  const year = dateObj.toLocaleString('en-US', { year: 'numeric', ...options });
  const month = dateObj.toLocaleString('en-US', { month: '2-digit', ...options });
  const day = dateObj.toLocaleString('en-US', { day: '2-digit', ...options });
  const hours = dateObj.toLocaleString('en-US', { hour: '2-digit', hour12: false, ...options });
  const minutes = dateObj.toLocaleString('en-US', { minute: '2-digit', ...options });
  const seconds = dateObj.toLocaleString('en-US', { second: '2-digit', ...options });
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Check if a given time is in the future (Indian timezone)
const isTimeInFuture = (dateTime) => {
  const now = new Date();
  const options = { timeZone: 'Asia/Kolkata' };
  const nowInIST = new Date(now.toLocaleString('en-US', options));
  const checkTime = new Date(dateTime);
  
  return checkTime > nowInIST;
};

module.exports = {
  formatDate,
  getCurrentIndianDate,
  formatMySQLDateTime,
  isTimeInFuture
};
