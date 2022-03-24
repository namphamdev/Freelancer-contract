import Head from "next/head";
import { useState } from "react";
import { useEffect } from "react";
import Web3 from "web3";
import ContractInfo from "../components/contractInfo";
import Loading from "../components/loading";
import ModalProject from "../components/modalProject";
import TableProject from "../components/tableProject";
import TotalBlock from "../components/totalBlock";
import freelancerArtifact from "../contracts/freelancer.json";

const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
export default function Home() {
  const [account, setAccount] = useState(false);
  const [balance, setBalance] = useState(0);
  const [contract, setContract] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [projectState, setProjectState] = useState("");
  const [totalEth, setTotalEth] = useState(0);
  const [totalDisbursed, setTotalDisbursed] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [showModalProject, setShowModalProject] = useState(false);
  const [startDate, setStartDate] = useState("0");
  const [endDate, setEndDate] = useState("0");
  const [canEndProject, setCanEndProject] = useState(false);
  const [loading, setLoading] = useState("");

  const getAccount = async () => {
    try {
      const accounts = await web3.eth.requestAccounts();
      if (accounts.length === 0) {
        return alert("No account found");
      }
      setAccount(accounts[0]);
      const getBalance = await web3.eth.getBalance(accounts[0]);
      const balance = web3.utils.fromWei(getBalance.toString(), "ether");
      setBalance(parseFloat(balance).toFixed(2));
    } catch (error) {
      console.error(error);
      console.error("Could not connect to contract or chain.");
    }
  };

  const getContract = async () => {
    if (!contractAddress) return deployNewContract();
    try {
      const contract = new web3.eth.Contract(
        freelancerArtifact.abi,
        contractAddress
      );
      setContract(contract);
      getContractData(contract);
      getEthValue(contract);
      getScheduleTable(contract);
    } catch (error) {
      console.error(error);
    }
  };

  const initContract = async (address) => {
    try {
      const contract = new web3.eth.Contract(freelancerArtifact.abi, address);
      setContract(contract);
      getContractData(contract);
      getEthValue(contract);
      getScheduleTable(contract);
    } catch (error) {
      console.error(error);
    }
  };

  const getContractData = async (contract) => {
    const freelancerAddress = await contract.methods.freelancerAddress().call();
    setFreelancerAddress(freelancerAddress);
    const clientAddress = await contract.methods.clientAddress().call();
    setClientAddress(clientAddress);
    const projectState = await contract.methods.projectState().call();
    setProjectState(projectState);
    setStartDate(await contract.methods.startDate().call());
    setEndDate(await contract.methods.endDate().call());
  };

  const getEthValue = async (contract) => {
    let totalDisbursed = 0;
    let totalValue = 0;
    const totalRow = await contract.methods.totalSchedules().call();
    for (let i = 0; i <= totalRow - 1; i++) {
      const result = await contract.methods.scheduleRegister(i).call();
      totalValue += result["value"] / 1000000000000000000;
      if (result["scheduleState"] == 4) {
        totalDisbursed += result["value"] / 1000000000000000000;
      }
    }
    setTotalEth(Math.round(totalValue * 100) / 100);
    setTotalDisbursed(Math.round(totalDisbursed * 100) / 100);
  };

  const getScheduleTable = async (contract) => {
    const totalRow = await contract.methods.totalSchedules().call();
    const tableData = [];
    let canEndProject = true;
    for (let i = 0; i <= totalRow - 1; i++) {
      const row = await contract.methods.scheduleRegister(i).call();
      tableData.push({
        shortCode: row["shortCode"],
        description: row["description"],
        value: web3.utils.fromWei(row["value"]),
        scheduleState: row["scheduleState"],
        startDate: row["startDate"],
        endDate: row["endDate"],
      });
      if (row["scheduleState"] != 4) canEndProject = false;
    }
    setCanEndProject(canEndProject);
    setTableData(tableData);
  };

  const deployNewContract = async () => {
    setLoading("Create contract");
    const freelancerContract = new web3.eth.Contract(freelancerArtifact.abi);
    freelancerContract
      .deploy({
        data: freelancerArtifact.bytecode,
        arguments: [],
      })
      .send({
        from: account,
      })
      .on("error", (error) => {
        setLoading(false);
        console.error(error);
        alert("Deploy new contract failed");
      })
      .on("receipt", (receipt) => {
        setLoading(false);
        setContractAddress(receipt.contractAddress);
        alert(
          `Deploy success! Your contract address ${receipt.contractAddress}`
        );
        initContract(receipt.contractAddress);
      });
  };

  const changeInput = (e) => {
    setContractAddress(e.target.value);
  };

  const handleGoBtn = () => {
    getContract();
  };

  const refreshData = () => {
    getContractData(contract);
    getEthValue(contract);
    getScheduleTable(contract);
  };

  const submitSchedule = async (data) => {
    setLoading("Submit schedule");
    try {
      const addSchedule = contract.methods.addSchedule(
        data.shortCode,
        data.description,
        web3.utils.toWei(data.value.toString(), "ether")
      );
      const result = await addSchedule.send({
        from: account,
      });
      setLoading(false);
      if (!result.transactionHash) {
        return alert("Submit schedule failed");
      }
      getEthValue(contract);
      getScheduleTable(contract);
      setShowModalProject(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const startWork = async (index) => {
    try {
      setLoading("Start Work");
      const result = await contract.methods
        .startTask(index, new Date().getTime())
        .send({ from: account });
      setLoading(false);
      if (!result.transactionHash) {
        return alert("Start work failed");
      }
      getScheduleTable(contract);
    } catch (error) {
      setLoading(false);
    }
  };

  const releaseFunds = async (index) => {
    try {
      setLoading("Release Funds");
      const result = await contract.methods
        .releaseFunds(index)
        .send({ from: account });
      setLoading(false);
      if (!result.transactionHash) {
        return alert("Start work failed");
      }
      getScheduleTable(contract);
    } catch (error) {
      setLoading(false);
    }
  };

  const endProject = async () => {
    try {
      setLoading("End Project");
      const result = await contract.methods
        .endProject(new Date().getTime())
        .send({ from: account });
      setLoading(false);
      if (!result.transactionHash) {
        return alert("End project failed");
      }
      refreshData();
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen flex flex-wrap items-center justify-center bg-gray-200 overflow-auto">
      <Head>
        <title>Freelancer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="min-w-[50%]">
        <div className="w-full rounded-lg border shadow-md flex flex-col p-5 bg-white">
          <div className="flex flex-col items-center">
            <p className="mt-1 text-3xl font-light text-gray-700">
              {" "}
              FREELANCER{" "}
            </p>
            {account && (
              <button className="mt-10 rounded py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 hover:text-gray-50 text-sm">
                {account}
              </button>
            )}
            {!account && (
              <button
                onClick={getAccount}
                className="mt-10 rounded py-2 px-4 bg-blue-500 text-white hover:bg-blue-700 hover:text-gray-50 text-sm"
              >
                Connect
              </button>
            )}
            {account && (
              <p className="mt-4 text-sm text-blue-600">
                {" "}
                Your balance: {balance}{" "}
              </p>
            )}
            <div className="h-0.5 bg-gray-200 w-full my-5"> </div>
          </div>
          {account && (
            <div className="flex flex-col px-3">
              <div className="flex rounded bg-white w-full">
                <input
                  type="text"
                  onChange={changeInput}
                  value={contractAddress}
                  className="w-full border bg-transparent px-4 py-1 text-gray-900 outline-none focus:outline-none"
                  placeholder="Enter contract address or leave blank to deploy a new one"
                />

                <button
                  type="button"
                  onClick={handleGoBtn}
                  className="m-2 rounded px-4 px-4 py-2 font-semibold bg-blue-500 text-white"
                >
                  Go
                </button>
              </div>
            </div>
          )}
        </div>
        {contract && (
          <div className="grid grid-cols-2 gap-5 mt-5">
            <ContractInfo
              contractAddress={contractAddress}
              freelancerAddress={freelancerAddress}
              clientAddress={clientAddress}
              projectState={projectState}
              startDate={startDate}
              endDate={endDate}
            />
            <div className="grid grid-cols-2 gap-5">
              <TotalBlock label={"Total Value (ETH)"} number={totalEth} />
              <TotalBlock label={"Disbursed (ETH)"} number={totalDisbursed} />
            </div>
          </div>
        )}
        {contract && (
          <>
            <TableProject
              role={"freelancer"}
              tableData={tableData}
              projectState={projectState}
              startWork={startWork}
              releaseFunds={releaseFunds}
            />
          </>
        )}
      </div>
      {showModalProject && (
        <ModalProject
          onSubmit={submitSchedule}
          closeModal={() => setShowModalProject(false)}
        />
      )}
      {contract && (
        <div className="fixed right-10 bottom-10 text-right">
          {projectState == 0 && (
            <button
              onClick={() => setShowModalProject(true)}
              className="disabled:opacity-75 bg-indigo-600 px-8 py-2 mt-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
            >
              Add Schedule
            </button>
          )}
          <br />
          {tableData.length > 0 && canEndProject && projectState != 2 && (
            <button
              onClick={endProject}
              className="disabled:opacity-75 ml-2 bg-green-600 px-8 py-2 mt-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
            >
              End Project
            </button>
          )}
          <br />
          <button
            onClick={refreshData}
            className="ml-2 bg-gray-600 px-8 py-2 mt-2 rounded-3xl text-gray-100 font-semibold uppercase tracking-wide"
          >
            Refresh
          </button>
        </div>
      )}
      {loading && <Loading label={loading} />}
    </div>
  );
}
