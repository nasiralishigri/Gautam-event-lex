// TransactionHistory.js
import React, { useState, useEffect } from "react";
import "./level-income.css";
// import Moralis from "moralis";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package

function LevelIncome({ ...props }) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilters] = useState("all");

  const handleFilterChange = (e) => {
    setFilters(e.target.value);
  };
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
        "0xb419cb7206d6f312a5672c9797e2bcd7a683773ef37c3475832ef48428297e11";
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
        name: "LevelsIncome",
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
      let datas = response.toJSON().result.map((transaction) => ({
        user: transaction.data._user,
        referrer: transaction.data._referral,
        date: new Date(transaction.data._time * 1000)
          .toISOString()
          .split("T")[0], // Adjust the format as needed
        time: new Date(transaction.data._time * 1000)
          .toTimeString()
          .split(" ")[0],
        level: transaction.data._level,
        transactionHash: transaction.transaction_hash,
      }));
      setTransactions(datas);
    };

    runApp();
  }, [props.account]);

  const handleLinkClick = (url) => {
    let baseUrl = "https://testnet.bscscan.com/tx/";
    window.open(baseUrl + url, "_blank");
  };
  const filteredTransactions =
    filter === "all"
      ? transactions.filter(
          (transaction) =>
            transaction.user.toLowerCase() === props.account.toLowerCase()
        )
      : transactions.filter(
          (transaction) =>
            transaction.user.toLowerCase() === props.account.toLowerCase() &&
            transaction.level.toString() == filter.toString()
        );
  return (
    <div className="PoolIncome-LevelIncome">
      <h1>Transaction History Of Level Income</h1>
      <div>
        <label>
          Filter by Level:
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </label>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Referrer</th>
              <th>Time</th>
              <th>Level</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.Time}>
                <td>{transaction.referrer}</td>
                <td>
                  {transaction.date} <br />
                  {transaction.time}
                </td>
                <td>{transaction.level}</td>
                <td className="scrollable-column">
                  <a
                    onClick={() => handleLinkClick(transaction.transactionHash)}
                    className="transaction-link"
                  >
                    {transaction.transactionHash}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LevelIncome;
