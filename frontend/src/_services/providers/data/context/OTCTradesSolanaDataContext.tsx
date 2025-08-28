import * as anchor from "@project-serum/anchor";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { createContext, useContext, useEffect, useState, useMemo } from "react";
import idl from "../idl/idl.json";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { OTCTradesSolanaFunctions } from './OTCTradesSolanaFunctions';

const PROGRAM_KEY = new PublicKey(idl.metadata.address);

export type OTCTradesSolanaTypeInterface = {
  user: any;
  transactions: any;
  initialized: boolean;
  initUser: (c: any) => void;
  createTransaction: (c: any) => void;
  walletAddress: string;
  walletHash: string;
  publicKey: any;
  wallets: any;
  select: (c: any) => void;
  disconnect: (c: any) => void;
  OTCTradesSolanaFunctions: any;

};

export const OTCTradesSolanaDataContext: Context<OTCTradesSolanaTypeInterface> =
  createContext<OTCTradesSolanaTypeInterface>({
    user: {},
    transactions: [],
    initialized: false,
    initUser: () => {},
    createTransaction: () => {},
    walletAddress: "",
    walletHash: "",
    publicKey: "",
  wallets: [],
  select: () => {},
  disconnect: () => {},
  OTCTradesSolanaFunctions,
  });

export const useOTCTradesSolanaData = () => {
  const context = useContext(OTCTradesSolanaDataContext);

  if (!context) {
    throw new Error("Parent must be wrapped inside OTCTradesSolanaProvider");
  }

  return context;
};

export const OTCTradesSolanaDataContextProvider = ({ children }: any) => {

  const { select, wallets, publicKey, disconnect }: any = useWallet();

  const [user, setUser] = useState();
  const [initialized, setInitialized] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionPending, setTransactionPending] = useState(false);
  const [lastTransactionId, setLastTransactionId] = useState();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletHash, setWalletHash] = useState("");

  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection(); 

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(idl, PROGRAM_KEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const start = async () => {
      if (program && publicKey) {
        setWalletAddress(publicKey.toString());
        setWalletHash(OTCTradesSolanaFunctions.generateWalletHash(publicKey.toString()));
        try {
          const [userPda] = await findProgramAddressSync(
            [utf8.encode("user"), publicKey.toBuffer()],
            program.programId
          );
          const user = await program.account.userAccount.fetch(userPda);
          if (user) {
            setInitialized(true);
            setUser(user);
            setLastTransactionId(user.lastTransactionId);
            const transactionAccounts: any =
              await program.account.transactionAccount.all(
                publicKey.toString() as any
              );
            setTransactions(transactionAccounts);
          }
        } catch (error) {
          console.log(error);
          setInitialized(false);
        }
      }
    };
    start();
    return () => {
      setInitialized(false);
      setUser(undefined);
      setLastTransactionId(undefined);
      setTransactions([]);
    };
  }, [program, publicKey, transactionPending]);

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const name = publicKey.toString();
        const walletHash:string = OTCTradesSolanaFunctions.generateWalletHash(publicKey.toString());
        await program.methods
          .initUser(name, walletHash)
          .accounts({
            userAccount: userPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        setInitialized(true);
      } catch (error) {
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const createTransaction = async (transactionID:string, transactionObject:any) => {
    if (program && publicKey) {
      setTransactionPending(true);
      try {
        const [userPda] = findProgramAddressSync(
          [utf8.encode("user"), publicKey.toBuffer()],
          program.programId
        );
        const [transactionPda] = findProgramAddressSync(
          [
            utf8.encode("transaction"),
            publicKey.toBuffer(),
            Uint8Array.from([lastTransactionId]),
          ],
          program.programId
        );

        await program.methods
          .createTransaction(transactionID, transactionObject)
          .accounts({
            userAccount: userPda,
            transactionAccount: transactionPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  return (
    <OTCTradesSolanaDataContext.Provider
      value={{
        user,
        transactions,
        initialized,
        initUser,
        createTransaction,
        walletAddress,
        walletHash,
        select, 
        wallets, 
        publicKey, 
        disconnect,
        OTCTradesSolanaFunctions
      }}
    >
      {children}
    </OTCTradesSolanaDataContext.Provider>
  );
};
