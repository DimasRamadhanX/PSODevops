const useCreateDate = () => {
  const dateObj = new Date();

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const day = dateObj.getDate();
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthName = monthNames[month];

  const pretty = `${monthName} ${day}, ${year} [${hours}:${minutes}]`; // tampil untuk user
  const iso = dateObj.toISOString(); // simpan untuk sorting

  return { pretty, iso };
};

export default useCreateDate;
