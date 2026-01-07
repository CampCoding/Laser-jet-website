
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
 
  
export function formattedDate(create_at) {
    const date = new Date(create_at);
    const month =  months[date?.getMonth()];
    const day = date?.getDate();
    const year = date?.getFullYear();
    const timeFormatted = new Intl.DateTimeFormat("en-US", {
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    })
    const time = timeFormatted.format(date)
    return `${month} ${day} , ${year} at ${time}`
}