import crypto from 'crypto';

export type Transaction = {
  sender: string;
  receiver: string;
  amount: number;
};

export type Block = {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  proof: number;
  prevHash: string;
};

export class Blockchain {
  chain: Block[] = [];
  currentTransactions: Transaction[] = [];
  constructor() {
    this.newBlock(1, '100');
  }

  newBlock(proof: number, prevHash: string): Block {
    const block: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof,
      prevHash,
    };

    // reset the current list of transactions
    this.currentTransactions = [];

    this.chain.push(block);
    return block;
  }

  newTransaction(sender: string, receiver: string, amount: number): number {
    this.currentTransactions.push({
      sender,
      receiver,
      amount,
    });
    return this.chain.indexOf(this.lastBlock()) + 1;
  }

  hash(block: Block): string {
    // utf-8 encodes the block
    const blockString: string = JSON.stringify(block);
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  lastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  proofOfWork(lastProof: number) {
    let proof: number = 0;
    while (!this.validateProof(lastProof, proof)) {
      console.log('mining block..');
      proof += 1;
    }
    return proof;
  }

  validateProof(lastProof: number, proof: number): boolean {
    const guess: string = `${lastProof}${proof}`;
    const guessHash: string = crypto
      .createHash('sha256')
      .update(guess)
      .digest('hex');
    return guessHash.slice(-3) == '000';
  }
}
