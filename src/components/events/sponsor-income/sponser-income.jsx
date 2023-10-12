// TransactionHistory.js
import React, { useState, useEffect } from "react";
import "./sponser-income.css";
// import Moralis from "moralis";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package

function SponserIncome({ ...props }) {
  const [transactions, setTransactions] = useState([]);
  let { web3 } = props;
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
        "0x23b5ce99046ef19224b4cbceac4f2c894c141e5e60c2e62e7f3edff030f85645";
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
            name: "_referrer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "_time",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "string",
            name: "Identity",
            type: "string",
          },
        ],
        name: "SponsorIncome",
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
        referrer: transaction.data._referrer,
        time: new Date(transaction.data._time * 1000).toISOString(), // Adjust the format as needed

        identity: transaction.data.Identity,

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
    <div className="PoolIncome-Sponsor">
      <h1>Transaction History Of Sponsor Income</h1>

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
            <th>Identity</th>
            <th>Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction) => (
            <tr key={transaction.user}>
              <td>{transaction.user}</td>
              <td>{transaction.referrer}</td>
              <td>{transaction.time}</td>
              <td>{transaction.identity}</td>
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
  );
}

export default SponserIncome;
