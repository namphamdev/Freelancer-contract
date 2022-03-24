export default function ProjectStatus({ statusNumber }) {
  const status = {
    0: {
      class: `inline-block rounded-full text-white 
      bg-blue-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Initiated",
    },
    1: {
      class: `inline-block rounded-full text-white 
      bg-green-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Accepted",
    },
    2: {
      class: `inline-block rounded-full text-white 
      bg-red-500 duration-300 
      text-xs font-bold 
      px-2 md:px-4 py-1 
      opacity-90 hover:opacity-100`,
      text: "Closed",
    },
  };
  return (
    <div className={status[statusNumber].class}>
      {status[statusNumber].text}
    </div>
  );
}
