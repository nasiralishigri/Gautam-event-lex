// TransactionHistory.js
import React, { useState, useEffect } from "react";
import "./autopool-income.css";
// import Moralis from "moralis";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package

function AutoPoolIncome({ ...props }) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilters] = useState("all");

  const handleFilterChange = (e) => {
    // Reset the filter to the newly selected value
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
        "0xbd53f67cfad1b161e1857c840f0f3430a080b8cf8b77f4183d4302c5daed15b4";
      const abi = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "sender",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "referrer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "height",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "time",
            type: "uint256",
          },
        ],
        name: "AutopoolIncome",
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
        user: transaction.data.sender,
        referrer: transaction.data.referrer,
        date: new Date(transaction.data.time * 1000)
          .toISOString()
          .split("T")[0], // Adjust the format as needed
        time: new Date(transaction.data.time * 1000)
          .toTimeString()
          .split(" ")[0],

        height: transaction.data.height,
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
            transaction.referrer.toLowerCase() === props.account.toLowerCase()
        )
      : transactions.filter(
          (transaction) =>
            transaction.referrer.toLowerCase() ===
              props.account.toLowerCase() && transaction.height == filter
        );
  return (
    <div className="PoolIncome-autopool">
      <h1>Transaction History Of Auto Pool Income</h1>

      <div>
        <label>
          Filter by Height:
          <select value={filter} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </label>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Sender</th>
              <th>Time</th>
              <th>Height</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.user}>
                <td>{transaction.user}</td>
                <td>
                  {transaction.date} <br />
                  {transaction.time}
                </td>
                <td>{transaction.height}</td>
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

export default AutoPoolIncome;
