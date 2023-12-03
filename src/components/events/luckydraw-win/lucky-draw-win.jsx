// TransactionHistory.js
import React, { useState, useEffect } from "react";
import "./lucky-draw-win.css";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package
function LuckyDrawWin({ ...props }) {
  const [transactions, setTransactions] = useState([]);
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
        "0xece26849988d1627dd651a357d99c795fa504210f5186090234f2930bf0215ce";
      const abi = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "uint256",
            name: "winner",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "luckyReward",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "startID",
            type: "uint256",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "endID",
            type: "uint256",
          },
        ],
        name: "LuckyDrawWin",
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
        winner: transaction.data.winner,
        luckyReward: parseFloat(
          props.web3.utils.fromWei(transaction.data.luckyReward, "ether")
        ).toFixed(4),
        endID: transaction.data.endID, // Adjust the format as needed
        startID: transaction.data.startID,
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
  return (
    <div className="PoolIncome-luckyDraw">
      <h1>Transaction History Of Lucky Draw Win</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Winner</th>
              <th>Luky Reward</th>
              <th>Start ID</th>
              <th>End ID</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.luckyReward}>
                <td>{transaction.winner}</td>
                <td>{transaction.luckyReward}</td>
                <td>{transaction.startID}</td>
                <td>{transaction.endID}</td>
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
export default LuckyDrawWin;
