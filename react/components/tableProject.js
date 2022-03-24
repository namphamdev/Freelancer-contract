import moment from "moment";
import ScheduleStatus from "./scheduleStatus";

export default function TableProject({
  role,
  tableData,
  projectState = false,
  releaseFunds = false,
  startWork = false,
  addFund = false,
  approveTask = false,
}) {
  return (
    <table className="w-full mt-5 mb-5 text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg shadow-md">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Short Code
          </th>
          <th scope="col" className="px-6 py-3">
            Description
          </th>
          <th scope="col" className="px-6 py-3 text-center">
            Value (in ETH)
          </th>
          <th scope="col" className="px-6 py-3 text-center">
            State
          </th>
          <th scope="col" className="px-6 py-3">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-center">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          <tr
            key={index}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
            >
              {item.shortCode}
            </th>
            <td className="px-6 py-4 text-gray-900">{item.description}</td>
            <td className="px-6 py-4 text-gray-900 text-center">{item.value}</td>
            <td className="px-6 py-4 text-center">
              <ScheduleStatus statusNumber={item.scheduleState} />
            </td>
            <td className="px-6 py-4 text-gray-900">
              {item.startDate != 0 && (
                <div>
                  Start Date:{" "}
                  {moment
                    .unix(item.startDate / 1000)
                    .format("DD/MM/YYYY hh:mm:ss")}
                  <br />
                </div>
              )}
              {item.endDate != 0 && (
                <div>
                  End Date:{" "}
                  {moment
                    .unix(item.endDate / 1000)
                    .format("DD/MM/YYYY hh:mm:ss")}
                </div>
              )}
            </td>
            {role === "freelancer" && (
              <td className="px-6 py-4 text-center">
                {item.scheduleState == 1 && (
                  <button
                    onClick={() => startWork(index)}
                    className="bg-green-500 px-4 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
                  >
                    Start work
                  </button>
                )}
                {item.scheduleState == 3 && (
                  <button
                    onClick={() => releaseFunds(index)}
                    className="bg-gray-500 px-4 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
                  >
                    Release Funds
                  </button>
                )}
              </td>
            )}
            {role === "client" && (
              <td className="px-6 py-4 text-center">
                {item.scheduleState == 0 && projectState > 0 && (
                  <button
                    onClick={() => addFund(index, item.value)}
                    className="bg-green-500 px-4 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
                  >
                    Fund
                  </button>
                )}
                {item.scheduleState == 2 && (
                  <button
                    onClick={() => approveTask(index)}
                    className="bg-gray-500 px-4 py-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
                  >
                    Approve
                  </button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
