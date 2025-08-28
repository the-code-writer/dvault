import * as anchor from "@coral-xyz/anchor";

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

const SolanaAirdropClass = class {

  connection: anchor.web3.Connection;

  constructor(connection: anchor.web3.Connection) {

    this.init(connection);

  }

  public init(connection: anchor.web3.Connection): void {

    this.connection = connection;

  }

  async requestSol(account: anchor.web3.PublicKey, amount: number): Promise<any> {

    return await this.connection.requestAirdrop(
      account,
      amount * LAMPORTS_PER_SOL
    );

  }

}

export { SolanaAirdropClass };