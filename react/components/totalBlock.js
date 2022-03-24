export default function TotalBlock({ label, number }) {
  return (
    <div className="rounded-lg border shadow-md py-3 px-5 bg-white">
      <h6 className="text-2xl border-b w-full border-gray-500 text-center pb-3">{label}</h6>
      <h4 className="text-black text-4xl font-bold text-center mt-5">
        {number}
      </h4>
    </div>
  );
}
