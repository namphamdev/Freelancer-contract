import moment from "moment";
import ProjectStatus from "./projectStatus";

export default function ContractInfo({
  contractAddress,
  freelancerAddress,
  clientAddress,
  projectState,
  startDate,
  endDate,
}) {
  return (
    <div className="py-3 px-5 bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h6 className="text-2xl border-b w-full border-gray-500 text-center pb-3">
          Your Freelancer contract
        </h6>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  Address
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {contractAddress}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  Freelancer&apos;s Wallet
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {freelancerAddress}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  Client&apos;s Wallet
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {clientAddress}
              </div>
            </div>
          </li>
          {startDate != 0 && (
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                    Start Date
                  </p>
                </div>
                {moment.unix(startDate / 1000).format("DD/MM/YYYY hh:mm:ss")}
              </div>
            </li>
          )}
          {endDate != 0 && (
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                    End Date
                  </p>
                </div>
                {moment.unix(endDate / 1000).format("DD/MM/YYYY hh:mm:ss")}
              </div>
            </li>
          )}
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate dark:text-white">
                  Project State
                </p>
              </div>
              {projectState && <ProjectStatus statusNumber={projectState} />}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
