export default function ScheduleStatus({ statusNumber }) {
  const status = {
    0: {
      class: `inline-block rounded-full text-white 
      bg-blue-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Planned",
    },
    1: {
      class: `inline-block rounded-full text-white 
      bg-green-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Funded",
    },
    2: {
      class: `inline-block rounded-full text-white 
      bg-green-700 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Started",
    },
    3: {
      class: `inline-block rounded-full text-white 
      bg-gray-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Approved",
    },
    4: {
      class: `inline-block rounded-full text-white 
      bg-orange-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Released",
    },
  };
  return (
    <div className={status[statusNumber].class}>
      {status[statusNumber].text}
    </div>
  );
}
