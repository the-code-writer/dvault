import * as anchor from "@coral-xyz/anchor";

const provider = anchor.AnchorProvider.env();

anchor.setProvider(provider);

const ProgramInstructions = class {
  async send(
    instructionsList: anchor.web3.TransactionInstruction[],
    payer: any,
    callbackSuccess: any,
    callbackError: any
  ): Promise<any> {
    try {
      const tx = new anchor.web3.Transaction();
      for (const ix of instructionsList) {
        tx.add(ix);
      }
      await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [
        payer,
      ]);
      if (typeof callbackSuccess === 'function') {
        callbackSuccess(tx);
      }
    } catch (error) {
      callbackError(error);
    }

  }
}

export { ProgramInstructions }
