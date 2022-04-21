import { Application } from 'express-serve-static-core';
import { Block, Blockchain } from './Blockchain';
module.exports = (app: Application) => {
  const blockchain: Blockchain = new Blockchain();

  app.get('/mine', (req, res) => {
    const lastBlock: Block = blockchain.lastBlock();
    const lastProof: number = lastBlock.proof;

    const proof: number = blockchain.proofOfWork(lastProof);

    blockchain.newTransaction('0', 'you', 1);

    const prevHash = blockchain.hash(lastBlock);
    const block = blockchain.newBlock(proof, prevHash);

    const response = {
      message: 'new block mined.',
      index: block.index,
      transactions: block.transactions,
      lastProof: lastProof,
      proof: block.proof,
      previousHash: block.prevHash,
    };
    res.json(response).status(200);
  });
  app.get('/chain', (req, res) => {
    res
      .json({
        chain: blockchain.chain,
        length: blockchain.chain.length,
      })
      .status(200);
  });

  app.post('/transactions/new', (req, res) => {
    const values = JSON.parse(req.body);
    const index = blockchain.newTransaction(
      values.sender,
      values.receiver,
      values.amount
    );
    res
      .json({
        message: `Transaction will be added to block ${index}`,
      })
      .status(201);
  });
};
