import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cellar } from "../../target/types/cellar";
import { Debank } from "../../target/types/debank";

interface ResolvedAccounts {
    cellarProgram?: anchor.web3.PublicKey;
    vaultTrackerAccount: anchor.web3.PublicKey;
    vaultAccount: anchor.web3.PublicKey;
    userAccount: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    systemProgram: anchor.web3.PublicKey;
}

interface TransactionItemState {
    initialized: boolean;
    user_index: number;
    name: string;
    balance: number;
    transactionItem_count: number;
    transactionItem_count: number;
    vault_account_public_key: string;
    user_secret_key: string;
    user_private_key: string;
    user_public_key: string;
    user_shared_key: string;
    user_hashed_pwd: string;
    user_passd_salt: string;
    user_oauth_data: string;
    user_last_key: string;
    user_account: string;
    vault_account: string;
    vault_tracker_account: string;
    authority: string;
    created_at: number;
    updated_at: number;
}

interface TransactionItemStateParsed {
    publicKey?: string;
    initialized: boolean;
    userIndex: number;
    name: string;
    balance: number;
    transactionItemCount: number;
    transactionItemCount: number;
    vaultAccountPublicKey: string;
    userSecretKey: string;
    userPrivateKey: string;
    userPublicKey: string;
    userSharedKey: string;
    userHashedPwd: string;
    userPassdSalt: string;
    userOauthData: string;
    userLastKey: string;
    userAccount: string;
    vaultAccount: string;
    vaultTrackerAccount: string;
    authority: string;
    createdAt: number;
    updatedAt: number;
}

interface TransactionItemItemInterface {
    initialized: boolean;
    userIndex: anchor.BN;
    name: string;
    balance: anchor.BN;
    transactionItemCount: anchor.BN;
    transactionItemCount: anchor.BN;
    vaultAccountPublicKey: anchor.web3.PublicKey;
    userSecretKey: string;
    userPrivateKey: string;
    userPublicKey: string;
    userSharedKey: string;
    userHashedPwd: string;
    userPassdSalt: string;
    userOauthData: string;
    userLastKey: anchor.web3.PublicKey;
    userAccount: anchor.web3.PublicKey;
    vaultAccount: anchor.web3.PublicKey;
    vaultTrackerAccount: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    createdAt: anchor.BN;
    updatedAt: anchor.BN;
}

interface TransactionItemStateInterface {
    publicKey: anchor.web3.PublicKey;
    account: TransactionItemItemInterface;
}

const TransactionItemAccountClass = class {

    program: anchor.Program<Cellar>;

    debankProgram: anchor.Program<Debank>;

    vaultTrackerAccount: any;

    vaultTrackerAccountKey: anchor.web3.PublicKey;

    vaultAccount: any;

    vaultAccountKey: anchor.web3.PublicKey;

    userAccount: any;

    userAccountKey: anchor.web3.PublicKey;

    transactionAccount: any;

    transactionAccountKey: anchor.web3.PublicKey;

    transactionItemAccount: any;

    transactionItemAccountKey: anchor.web3.PublicKey;

    authority: any;

    authorityKey: anchor.web3.PublicKey;

    public constructor(vaultTrackerAccount: any, vaultAccount: any, userAccount: any, transactionAccount: any, transactionItemAccount: any, authority: any) {

        this.setup(vaultTrackerAccount, vaultAccount, userAccount, transactionAccount, transactionItemAccount, authority);

    }

    public setup(vaultTrackerAccount: any, vaultAccount: any, userAccount: any, transactionAccount: any, transactionItemAccount: any, authority: any): void {

        this.program = anchor.workspace.Cellar as Program<Cellar>;

        this.debankProgram = anchor.workspace.Debank as Program<Debank>;

        this.vaultTrackerAccount = vaultTrackerAccount;

        this.vaultTrackerAccountKey = vaultTrackerAccount.publicKey;

        this.vaultAccount = vaultAccount;

        this.vaultAccountKey = vaultAccount.publicKey;

        this.userAccount = userAccount;

        this.userAccountKey = userAccount.publicKey;

        this.transactionAccount = transactionItemAccount;

        this.transactionAccountKey = transactionItemAccount.publicKey;

        this.transactionItemAccount = transactionItemAccount;

        this.transactionItemAccountKey = transactionItemAccount.publicKey;

        this.authority = authority;

        this.authorityKey = authority.publicKey;
    }

    public async all(): Promise<TransactionItemStateParsed[]> {
        const transactionItemStateAccounts: Array<TransactionItemStateInterface> =
            await this.program.account.transactionItemState.all();

        const parsedTransactionItemStateAccounts: Array<TransactionItemStateParsed> =
            this.parseTransactionItemAccounts(transactionItemStateAccounts);

        return parsedTransactionItemStateAccounts;
    }

    public async fetch(
        publicKey: string
    ): Promise<TransactionItemStateParsed> {
        const transactionItemStateAccount: TransactionItemItemInterface =
            await this.program.account.transactionItemState.fetch(publicKey);

        const parsedTransactionItemStateAccount: TransactionItemStateParsed =
            this.parseItem(transactionItemStateAccount);

        return parsedTransactionItemStateAccount;
    }

    public async fetchMultiple(
        publicKeys: Array<string>
    ): Promise<TransactionItemStateParsed[]> {
        const transactionItemStateAccounts: any =
            await this.program.account.transactionItemState.fetchMultiple(publicKeys);

        const parsedTransactionItemStateAccounts: Array<TransactionItemStateParsed> =
            this.parseTransactionItemAccounts(transactionItemStateAccounts);

        return parsedTransactionItemStateAccounts;
    }

    public toString(accounts: Array<TransactionItemStateInterface>): string {
        return JSON.stringify(this.parseTransactionItemAccounts(accounts));
    }

    public parse(
        account: TransactionItemItemInterface,
        publicKey: anchor.web3.PublicKey = null
    ): TransactionItemStateParsed {
        const parsed: TransactionItemStateParsed = this.parseItem(account);
        if (publicKey) {
            parsed.publicKey = publicKey.toString();
        }
        return parsed;
    }

    public parseItem(
        account: TransactionItemItemInterface
    ): TransactionItemStateParsed {
        const parsed: TransactionItemStateParsed = {
            initialized: account.initialized,
            userIndex: account.userIndex.toNumber(),
            name: account.name.toString(),
            balance: account.balance.toNumber(),
            transactionItemCount: account.transactionItemCount.toNumber(),
            transactionItemCount: account.transactionItemCount.toNumber(),
            vaultAccountPublicKey: account.vaultAccountPublicKey.toString(),
            userSecretKey: account.userSecretKey.toString(),
            userPrivateKey: account.userPrivateKey.toString(),
            userPublicKey: account.userPublicKey.toString(),
            userSharedKey: account.userSharedKey.toString(),
            userHashedPwd: account.userHashedPwd.toString(),
            userPassdSalt: account.userPassdSalt.toString(),
            userOauthData: account.userOauthData.toString(),
            userLastKey: account.userLastKey.toString(),
            userAccount: account.userAccount.toString(),
            vaultAccount: account.vaultAccount.toString(),
            vaultTrackerAccount: account.vaultTrackerAccount.toString(),
            authority: account.authority.toString(),
            createdAt: account.createdAt.toNumber(),
            updatedAt: account.updatedAt.toNumber(),
        };
        return parsed;
    }

    public parseTransactionItemAccounts(
        accounts: Array<TransactionItemStateInterface>
    ): Array<TransactionItemStateParsed> {
        return accounts.map(
            (data: TransactionItemStateInterface | TransactionItemItemInterface | any) => {
                if (data.hasOwnProperty("publicKey")) {
                    return this.parse(data?.account, data.publicKey);
                } else {
                    return this.parse(data, undefined);
                }
            }
        );
    }

    public async init(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey
    ): Promise<any> {
        const resolvedAccounts: ResolvedAccounts = {
            userAccount: this.userAccountKey,
            vaultAccount: this.vaultAccountKey,
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        return await this.program.methods
            .initializeTransactionItemAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultTrackerAccount, this.vaultAccount, this.userAccount, this.authority])
            .rpc();
    }

    public async initCPI(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey
    ): Promise<any> {

        const resolvedAccounts: ResolvedAccounts = {
            cellarProgram: this.program.programId,
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            vaultAccount: this.vaultAccountKey,
            userAccount: this.userAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        await this.debankProgram.methods
            .cpiInitializeTransactionItemAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultTrackerAccount, this.vaultAccount, this.userAccount, this.authority])
            .rpc();

    }

    public async isInitialized(): Promise<boolean> {

        const userAccount = await this.debankProgram.account.transactionItemState.fetch(
            this.userAccountKey
        );
        return userAccount.initialized;

    }

};

export {
    TransactionItemAccountClass,
    TransactionItemState,
    TransactionItemStateParsed,
    TransactionItemStateInterface,
    TransactionItemItemInterface,
};
