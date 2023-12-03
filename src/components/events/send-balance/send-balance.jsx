import React, { useState, useEffect } from "react";
import "./send-balance.css";
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils"; // Import EvmChain from the correct package

function SendBalance({ ...props }) {
  const [transactions, setTransactions] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
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
        "0x85564825e768c97dfb9dc0b3f8c205b076e86cd7637219b43f6ba7a748f6dbb9";
      const abi = {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "referer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "SendBalance",
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
        referrer: transaction.data.referer,
        amount: parseFloat(
          props.web3.utils.fromWei(transaction.data.amount, "ether")
        ).toFixed(4),
        transactionHash: transaction.transaction_hash,
      }));
      setTransactionData(datas);
      const filteredTransactions = datas.filter(
        (transaction) =>
          transaction.amount != 0 &&
          transaction.referrer ==
            (props.account ? props.account.toLowerCase() : props.account)
      );
      setTransactions(filteredTransactions);
    };
    runApp();
  }, [props.account]);
  const handleLinkClick = (url) => {
    let baseUrl = "https://testnet.bscscan.com/tx/";
    window.open(baseUrl + url, "_blank");
  };
  return (
    <div className="PoolIncome-SendBalance">
      <h1>Transaction History Of Send Balance</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Referrer</th>
              <th>amount</th>
              <th>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.user}>
                <td>{transaction.referrer}</td>
                <td>{transaction.amount}</td>
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

export default SendBalance;
