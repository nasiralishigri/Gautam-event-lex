// TransactionHistory.js
import React, { useState, useEffect } from "react";
import "./stage-income.css";
// import Moralis from "moralis";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package

function StageIncome({ ...props }) {
  const [transactions, setTransactions] = useState([]);
  console.log("Props :", props.account, props);
  useEffect(() => {
    const runApp = async () => {
      if (!Moralis.Core.isStarted)
        await Moralis.start({
          apiKey:
            "khlUdKYkvJvA9Ruj0n0Ire7Foax3m7LY7g0inZbSqzZC8rttoDgxAqtggzGah91U",
        });
      const address = "0x7716dB181506939Ed6Ba6e35755A8668D8668D9A"; //"0xe184a68428072f0102f073a098af8ee7705519dc";
      const chain = EvmChain.BSC_TESTNET;
      const topic =
        "0xe655a13ddd4b7f0f56febd549e2d4818002460dad585dd4f7af4ab1d231fa553";
      const abi = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "_user",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "_referral",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "_level",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_time",
            type: "uint256",
          },
        ],
        name: "stageIncome",
        type: "event",
      };
      let limit = 10000;
      const response = await Moralis.EvmApi.events.getContractEvents({
        address,
        chain,
        limit,
        topic,
        abi,
      });
      console.log(response.toJSON());
      let datas = response.toJSON().result.map((transaction) => ({
        user: transaction.data._user,
        referrer: transaction.data._referral,
        time: new Date(transaction.data._time * 1000).toISOString(), // Adjust the format as needed

        level: transaction.data._level,

        // identity: transaction.data.Identity,
        transactionHash: transaction.transaction_hash,
      }));
      console.log("Transaction:", datas);
      setTransactions(datas);
    };

    runApp();
  }, []);

  const handleLinkClick = (url) => {
    let baseUrl = "https://testnet.bscscan.com/tx/";
    console.log("Tar:", url);
    window.open(baseUrl + url, "_blank");
  };

  console.log("Transaction Data: ", transactions);
  const [filter, setFilter] = useState("All");
  const filteredTransactions =
    filter === "referrer"
      ? transactions.filter(
          (transaction) =>
            transaction.referrer.toLowerCase() === props.account.toLowerCase()
        )
      : transactions.filter(
          (transaction) =>
            transaction.user.toLowerCase() === props.account.toLowerCase()
        );
  console.log("Filter Transation", filteredTransactions);

  return (
    <div className="PoolIncome">
      <h1>Transaction History Of Stage Income</h1>

      <div>
        <label>
          Filter by Referrer:
          <select onChange={(e) => setFilter(e.target.value)}>
            <option value="No">No</option>
            <option value="referrer">Yes</option>
          </select>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Referrer</th>
            <th>Time</th>
            <th>Level</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.user}>
              <td>{transaction.user}</td>
              <td>{transaction.referrer}</td>
              <td>{transaction.time}</td>
              <td>{transaction.level}</td>
              <td className="scrollable-column">
                <button
                  onClick={() => handleLinkClick(transaction.transactionHash)}
                >
                  {transaction.transactionHash}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StageIncome;



// stageIncome( only visible for subadmin-true)
// AutopoolIncome
// LuckyDrawWin
// SendBalance ( only visible for subadmin-true)
// SponsorIncome
// LevelsIncome