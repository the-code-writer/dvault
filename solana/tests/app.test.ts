import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import { Cellar } from "../target/types/cellar";
import { Teller } from "../target/types/teller";
import { Debank } from "../target/types/debank";
import { expect, assert } from "chai";
import { VaultTrackerAccountClass } from "./accounts/VaultTrackerAccount";
import { VaultAccountClass } from "./accounts/VaultAccount";
import { UserAccountClass } from "./accounts/UserAccount";
import { TransactionAccountClass } from "./accounts/TransactionAccount";
import { TransactionItemAccountClass } from "./accounts/TransactionItemAccount";
import { TokenAccountClass } from "./accounts/TokenAccount";
import { SolanaAirdropClass } from "./solana/Airdrops";

const provider = anchor.AnchorProvider.env();

anchor.setProvider(provider);

const parseSolanaErrorFromLogs: any = (input: string): Array<string> => {

  //console.log("ERROR:", input)

  const startIndex = input.indexOf('Logs:') + 6;
  const endIndex = input.indexOf('].') + 1;
  const logsString = input.substring(startIndex, endIndex);
  const logsArray = JSON.parse(logsString);

  return logsArray;

}

describe("Debank", () => {

  const connection = provider.connection;

  const wallet = provider.wallet as anchor.Wallet;

  const userWalletKey = provider.wallet.publicKey;

  const authority = anchor.web3.Keypair.generate();

  const authorityKey = authority.publicKey;

  const vaultProgram = anchor.workspace.Cellar as Program<Cellar>;

  const debankProgram = anchor.workspace.Debank as Program<Debank>;

  const vaultTrackerKeypair = Keypair.generate();

  const vaultKeypair = Keypair.generate();

  const userKeypair = Keypair.generate();

  const transactionKeyPair = Keypair.generate();

  const transactionItemKeyPair = Keypair.generate();

  const tokenKeyPair = Keypair.generate();

  const vaultInitialKeypair = new Keypair();

  const userInitialKeypair = new Keypair();

  const newAccount = new Keypair();

  const solanaAirdrops = new SolanaAirdropClass(connection);

  const vaultTrackerAccountClass = new VaultTrackerAccountClass(vaultTrackerKeypair, authority);
  const vaultAccountClass = new VaultAccountClass(vaultTrackerKeypair, vaultKeypair, authority);
  const userAccountClass = new UserAccountClass(vaultTrackerKeypair, vaultKeypair, userKeypair, authority);
  const transactionAccountClass = new TransactionAccountClass(vaultTrackerKeypair, vaultKeypair, userKeypair, transactionKeyPair, authority);
  const transactionItemAccountClass = new TransactionItemAccountClass(vaultTrackerKeypair, vaultKeypair, userKeypair, transactionKeyPair, transactionItemKeyPair, authority);
  const tokenAccountClass = new TokenAccountClass(vaultTrackerKeypair, vaultKeypair, userKeypair, tokenKeyPair, authority);

  const fundAmount: anchor.BN = new anchor.BN(5 * LAMPORTS_PER_SOL);

  const debankName: string = String("HANDSHAKE::RoundHouse");

  solanaAirdrops.requestSol(wallet.publicKey, 5);

  solanaAirdrops.requestSol(authorityKey, 5);

  const [rentVaultPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("rent_vault")],
    vaultProgram.programId
  );

  it("Does [CPIs] Cross Program Invocations!", async () => {

    await vaultProgram.methods
      .initialize(authorityKey)
      .accounts({
        cellar: vaultKeypair.publicKey,
        user: provider.wallet.publicKey,
      })
      .signers([vaultKeypair])
      .rpc();

    await debankProgram.methods
      .setBankName(debankName)
      .accounts({
        vaultProgram: vaultProgram.programId,
        cellar: vaultKeypair.publicKey,
        authority: authorityKey,
      })
      .signers([authority])
      .rpc();

    expect(
      (
        await vaultProgram.account.data.fetch(vaultKeypair.publicKey)
      ).data.toString()
    ).to.equal(debankName);

  });

  it("Initialize the Rent Vault", async () => {

    await vaultProgram.methods
      .initRentVault(fundAmount)
      .accounts({
        payer: wallet.publicKey,
        rentVault: rentVaultPDA,
      })
      .rpc();
    // Check rent vault balance
    const accountInfo = await vaultProgram.provider.connection.getAccountInfo(
      rentVaultPDA
    );
    assert(accountInfo.lamports === fundAmount.toNumber());
  });

  it("Create a new account using the Rent Vault", async () => {

    await vaultProgram.methods
      .createNewAccount()
      .accounts({
        rentVault: rentVaultPDA,
        newAccount: newAccount.publicKey,
      })
      .signers([newAccount])
      .rpc({
        feePayer: wallet.publicKey,
      });

    // Minimum balance for rent exemption for new account
    const lamports = await connection.getMinimumBalanceForRentExemption(0);

    // Check that the account was created
    const accountInfo = await connection.getAccountInfo(newAccount.publicKey);

    assert(accountInfo.lamports === lamports);

  });

  describe("Vault Tracker Account", () => {

    it("Initialize the Vault Tracker Account", async () => {

      await vaultTrackerAccountClass.init(
        vaultInitialKeypair.publicKey,
        userInitialKeypair.publicKey,
        () => { },
        null
      );

      const vaultTrackerStateAccounts = await vaultTrackerAccountClass.all();

      //console.log(vaultTrackerStateAccounts);

      assert(vaultTrackerStateAccounts[0].vaultCurrentIndex === 0);
      assert(
        vaultTrackerStateAccounts[0].vaultLastKey ===
        vaultInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccounts[0].userCurrentIndex === 0);
      assert(
        vaultTrackerStateAccounts[0].userLastKey ===
        userInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccounts[0].transactionCurrentIndex === 0);
      assert(vaultTrackerStateAccounts[0].initialized === true);

      const vaultTrackerStateAccount = await vaultTrackerAccountClass.fetch(
        vaultTrackerStateAccounts[0].publicKey
      );

      //console.log(vaultTrackerStateAccount);

      assert(vaultTrackerStateAccount.vaultCurrentIndex === 0);
      assert(
        vaultTrackerStateAccount.vaultLastKey ===
        vaultInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccount.userCurrentIndex === 0);
      assert(
        vaultTrackerStateAccount.userLastKey ===
        userInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccount.transactionCurrentIndex === 0);
      assert(vaultTrackerStateAccount.initialized === true);

      const vaultTrackerStateAccountMultiple =
        await vaultTrackerAccountClass.fetchMultiple([
          vaultTrackerStateAccounts[0].publicKey,
        ]);

      //console.log(vaultTrackerStateAccountMultiple);

      assert(vaultTrackerStateAccountMultiple[0].vaultCurrentIndex === 0);
      assert(
        vaultTrackerStateAccountMultiple[0].vaultLastKey ===
        vaultInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccountMultiple[0].userCurrentIndex === 0);
      assert(
        vaultTrackerStateAccountMultiple[0].userLastKey ===
        userInitialKeypair.publicKey.toString()
      );
      assert(vaultTrackerStateAccountMultiple[0].transactionCurrentIndex === 0);
      assert(vaultTrackerStateAccountMultiple[0].initialized === true);
    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account has been created", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(result.length === 1);

    });

    it("VaultTrackerAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account public key is the correct one", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(result[0].vaultTrackerAccountKey === result[0].publicKey);

      assert(result[0].vaultTrackerAccountKey === vaultTrackerKeypair.publicKey.toString());

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account user last key is the correct one", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(
        result[0].userLastKey ===
        userInitialKeypair.publicKey.toString()
      );

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account user last key is the correct one", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(
        result[0].vaultLastKey ===
        vaultInitialKeypair.publicKey.toString()
      );

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account vault current index is 0", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(
        result[0].vaultCurrentIndex === 0
      );

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account user current index is 0", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(
        result[0].userCurrentIndex === 0
      );

    });

    it("VaultTrackerAccount:: It checks if the Vault Tracker Account transaction current index is 0", async () => {

      const result = await vaultTrackerAccountClass.all();

      assert(
        result[0].transactionCurrentIndex === 0
      );

    });

    it("Throw an error when using an already registered Vault Tracker Account Public Key", async () => {

      let errorString: string = "";

      try {

        await vaultTrackerAccountClass.init(
          vaultInitialKeypair.publicKey,
          userInitialKeypair.publicKey,
          () => { },
          null
        );

      } catch (error) {

        const logsArray: Array<string> = parseSolanaErrorFromLogs(error.toString());

        errorString = logsArray[3];

      } finally {

        const pattern = /^Allocate: account Address .* already in use$/;

        if (pattern.test(errorString)) {

          const addressRegex = /address: (\w+)/;

          const match = errorString.match(addressRegex);

          if (match) {

            const address = match[1];

            expect(vaultTrackerKeypair.publicKey.toString() === address);

          }

        } else {

          console.log('All good!');

        }

      }

    });

    it("Throw an error when re-creating another Vault Tracker Account", async () => {

      let errorString: string = "";

      const anotherVaultTrackerKeypair = Keypair.generate();

      try {

        await vaultTrackerAccountClass.init(
          vaultInitialKeypair.publicKey,
          userInitialKeypair.publicKey,
          (event) => {

            console.log('NEW VAULT ACCOUNT', event.vaultTrackerAccount.toString());

          },
          anotherVaultTrackerKeypair
        );

        const result = await vaultTrackerAccountClass.all();

      } catch (error) {

        const logsArray: Array<string> = parseSolanaErrorFromLogs(error.toString());

        errorString = logsArray[4];

      } finally {

        const pattern = /VaultError: .*$/;

        if (pattern.test(errorString)) {

          const addressRegex = /public key: (\w+)/;

          const match = errorString.match(addressRegex);

          if (match) {

            const address = match[1];

            expect(vaultTrackerKeypair.publicKey.toString() === address);

          }

        } else {

          console.log('All good!');

        }

      }

    });

    //////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // VAULT ACCOUNT
    //
    /////////////////////////////////////////////////////////////////////////////////////////////////

    describe("Vault Account", () => {

      it("Initialize the Vault Tracker Account", async () => {

        await vaultAccountClass.init(
          () => { },
          null
        );

        const vaultStateAccounts = await vaultAccountClass.all();

        //console.log(vaultStateAccounts);

        assert(vaultStateAccounts[0].vaultCurrentIndex === 0);
        assert(
          vaultStateAccounts[0].vaultLastKey ===
          vaultInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccounts[0].userCurrentIndex === 0);
        assert(
          vaultStateAccounts[0].userLastKey ===
          userInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccounts[0].transactionCurrentIndex === 0);
        assert(vaultStateAccounts[0].initialized === true);

        const vaultStateAccount = await vaultAccountClass.fetch(
          vaultStateAccounts[0].publicKey
        );

        //console.log(vaultStateAccount);

        assert(vaultStateAccount.vaultCurrentIndex === 0);
        assert(
          vaultStateAccount.vaultLastKey ===
          vaultInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccount.userCurrentIndex === 0);
        assert(
          vaultStateAccount.userLastKey ===
          userInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccount.transactionCurrentIndex === 0);
        assert(vaultStateAccount.initialized === true);

        const vaultStateAccountMultiple =
          await vaultAccountClass.fetchMultiple([
            vaultStateAccounts[0].publicKey,
          ]);

        //console.log(vaultStateAccountMultiple);

        assert(vaultStateAccountMultiple[0].vaultCurrentIndex === 0);
        assert(
          vaultStateAccountMultiple[0].vaultLastKey ===
          vaultInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccountMultiple[0].userCurrentIndex === 0);
        assert(
          vaultStateAccountMultiple[0].userLastKey ===
          userInitialKeypair.publicKey.toString()
        );
        assert(vaultStateAccountMultiple[0].transactionCurrentIndex === 0);
        assert(vaultStateAccountMultiple[0].initialized === true);
      });

      it("VaultAccount:: It checks if the Vault Tracker Account has been created", async () => {

        const result = await vaultAccountClass.all();

        assert(result.length === 1);

      });

      it("VaultAccount:: It checks if it has been initialized", async () => {

        const result = await vaultAccountClass.isInitialized();

        assert(result === true);

      });

      it("VaultAccount:: It checks if the Vault Tracker Account public key is the correct one", async () => {

        const result = await vaultAccountClass.all();

        assert(result[0].vaultAccountKey === result[0].publicKey);

        assert(result[0].vaultAccountKey === vaultKeypair.publicKey.toString());

      });

      it("VaultAccount:: It checks if the Vault Tracker Account user last key is the correct one", async () => {

        const result = await vaultAccountClass.all();

        assert(
          result[0].userLastKey ===
          userInitialKeypair.publicKey.toString()
        );

      });

      it("VaultAccount:: It checks if the Vault Tracker Account user last key is the correct one", async () => {

        const result = await vaultAccountClass.all();

        assert(
          result[0].vaultLastKey ===
          vaultInitialKeypair.publicKey.toString()
        );

      });

      it("VaultAccount:: It checks if the Vault Tracker Account vault current index is 0", async () => {

        const result = await vaultAccountClass.all();

        assert(
          result[0].vaultCurrentIndex === 0
        );

      });

      it("VaultAccount:: It checks if the Vault Tracker Account user current index is 0", async () => {

        const result = await vaultAccountClass.all();

        assert(
          result[0].userCurrentIndex === 0
        );

      });

      it("VaultAccount:: It checks if the Vault Tracker Account transaction current index is 0", async () => {

        const result = await vaultAccountClass.all();

        assert(
          result[0].transactionCurrentIndex === 0
        );

      });

      it("Throw an error when using an already registered Vault Tracker Account Public Key", async () => {

        let errorString: string = "";

        try {

          await vaultAccountClass.init(
            vaultInitialKeypair.publicKey,
            userInitialKeypair.publicKey,
            () => { },
            null
          );

        } catch (error) {

          const logsArray: Array<string> = parseSolanaErrorFromLogs(error.toString());

          errorString = logsArray[3];

        } finally {

          const pattern = /^Allocate: account Address .* already in use$/;

          if (pattern.test(errorString)) {

            const addressRegex = /address: (\w+)/;

            const match = errorString.match(addressRegex);

            if (match) {

              const address = match[1];

              expect(vaultKeypair.publicKey.toString() === address);

            }

          } else {

            console.log('All good!');

          }

        }

      });

      it("Throw an error when re-creating another Vault Tracker Account", async () => {

        let errorString: string = "";

        const anotherVaultKeypair = Keypair.generate();

        try {

          await vaultAccountClass.init(
            vaultInitialKeypair.publicKey,
            userInitialKeypair.publicKey,
            (event) => {

              console.log('NEW VAULT ACCOUNT', event.vaultAccount.toString());

            },
            anotherVaultKeypair
          );

          const result = await vaultAccountClass.all();

        } catch (error) {

          const logsArray: Array<string> = parseSolanaErrorFromLogs(error.toString());

          errorString = logsArray[4];

        } finally {

          const pattern = /VaultError: .*$/;

          if (pattern.test(errorString)) {

            const addressRegex = /public key: (\w+)/;

            const match = errorString.match(addressRegex);

            if (match) {

              const address = match[1];

              expect(vaultKeypair.publicKey.toString() === address);

            }

          } else {

            console.log('All good!');

          }

        }

      });

    })


  })

  describe("Debank Vault Account :: Methods", () => {

    it("VaultTrackerAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

  })

  describe("Debank User Account :: Methods", () => {

    it("UserAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

  })

  describe("Debank Transaction Account :: Methods", () => {

    it("TransactionAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

  })

  describe("Debank Transaction Item Account :: Methods", () => {

    it("TransactionItemAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

  })

  describe("Debank Token Account :: Methods", () => {

    it("TokenAccount:: It checks if it has been initialized", async () => {

      const result = await vaultTrackerAccountClass.isInitialized();

      assert(result === true);

    });

  })

});
