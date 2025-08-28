import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cellar } from "../../target/types/cellar";
import { Debank } from "../../target/types/debank";

interface ResolvedAccounts {
    vaultProgram?: anchor.web3.PublicKey;
    vaultTrackerAccount: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    systemProgram: anchor.web3.PublicKey;
}

interface VaultState {
    initialized: boolean;
    user_initialized: boolean;
    transaction_initialized: boolean;
    vault_index: number;
    name: string;
    description: string;
    vault_account: string;
    authority: string;
    vault_last_key: string;
    user_last_key: string;
    transaction_last_key: string;
    transaction_count: number;
    token_count: number;
    user_count: number;
    created_at: number;
    updated_at: number;
}

interface VaultStateParsed {
    publicKey?: string;
    initialized: boolean;
    userInitialized: boolean;
    transactionInitialized: boolean;
    vaultIndex: number;
    name: string;
    description: string;
    vaultAccount: string;
    authority: string;
    vaultLastKey: string;
    userLastKey: string;
    transactionLastKey: string;
    transactionCount: number;
    tokenCount: number;
    userCount: number;
    createdAt: number;
    updatedAt: number;
}

interface VaultItemInterface {
    initialized: boolean;
    userInitialized: boolean;
    transactionInitialized: boolean;
    vaultIndex: anchor.BN;
    name: string;
    description: string;
    vaultAccount: anchor.web3.PublicKey;
    authority: anchor.web3.PublicKey;
    vaultLastKey: anchor.web3.PublicKey;
    userLastKey: anchor.web3.PublicKey;
    transactionLastKey: anchor.web3.PublicKey;
    transactionCount: anchor.BN;
    tokenCount: anchor.BN;
    userCount: anchor.BN;
    createdAt: anchor.BN;
    updatedAt: anchor.BN;
}

interface VaultStateInterface {
    publicKey: anchor.web3.PublicKey;
    account: VaultItemInterface;
}

const VaultAccountClass = class {

    program: anchor.Program<Cellar>;

    debankProgram: anchor.Program<Debank>;

    vaultTrackerAccount: any;

    vaultTrackerAccountKey: anchor.web3.PublicKey;

    vaultAccount: any;

    vaultAccountKey: anchor.web3.PublicKey;

    authority: any;

    authorityKey: anchor.web3.PublicKey;

    public constructor(vaultTrackerAccount: any, vaultAccount: any, authority: any) {

        this.setup(vaultTrackerAccount, vaultAccount, authority);

    }

    public setup(vaultTrackerAccount: any, vaultAccount: any, authority: any): void {

        this.program = anchor.workspace.Cellar as Program<Cellar>;

        this.debankProgram = anchor.workspace.Debank as Program<Debank>;

        this.vaultTrackerAccount = vaultTrackerAccount;

        this.vaultTrackerAccountKey = vaultTrackerAccount.publicKey;

        this.vaultAccount = vaultAccount;

        this.vaultAccountKey = vaultAccount.publicKey;

        this.authority = authority;

        this.authorityKey = authority.publicKey;
    }

    public async all(): Promise<VaultStateParsed[]> {
        const vaultStateAccounts: Array<VaultStateInterface> =
            await this.program.account.vaultTrackerState.all();

        const parsedVaultStateAccounts: Array<VaultStateParsed> =
            this.parseVaultAccounts(vaultStateAccounts);

        return parsedVaultStateAccounts;
    }

    public async fetch(
        publicKey: string
    ): Promise<VaultStateParsed> {
        const vaultStateAccount: VaultItemInterface =
            await this.program.account.vaultTrackerState.fetch(publicKey);

        const parsedVaultStateAccount: VaultStateParsed =
            this.parseItem(vaultStateAccount);

        return parsedVaultStateAccount;
    }

    public async fetchMultiple(
        publicKeys: Array<string>
    ): Promise<VaultStateParsed[]> {
        const vaultStateAccounts: any =
            await this.program.account.vaultTrackerState.fetchMultiple(publicKeys);

        const parsedVaultStateAccounts: Array<VaultStateParsed> =
            this.parseVaultAccounts(vaultStateAccounts);

        return parsedVaultStateAccounts;
    }

    public toString(accounts: Array<VaultStateInterface>): string {
        return JSON.stringify(this.parseVaultAccounts(accounts));
    }

    public parse(
        account: VaultItemInterface,
        publicKey: anchor.web3.PublicKey = null
    ): VaultStateParsed {
        const parsed: VaultStateParsed = this.parseItem(account);
        if (publicKey) {
            parsed.publicKey = publicKey.toString();
        }
        return parsed;
    }

    public parseItem(
        account: VaultItemInterface
    ): VaultStateParsed {
        const parsed: VaultStateParsed = {
            initialized: account.initialized,
            userInitialized: account.userInitialized,
            transactionInitialized: account.transactionInitialized,
            vaultIndex: account.vaultIndex.toNumber(),
            name: account.name.toString(),
            description: account.description.toString(),
            vaultAccount: account.vaultAccount.toString(),
            authority: account.authority.toString(),
            vaultLastKey: account.vaultLastKey.toString(),
            userLastKey: account.userLastKey.toString(),
            transactionLastKey: account.transactionLastKey.toString(),
            transactionCount: account.transactionCount.toNumber(),
            tokenCount: account.tokenCount.toNumber(),
            userCount: account.userCount.toNumber(),
            createdAt: account.createdAt.toNumber(),
            updatedAt: account.updatedAt.toNumber(),
        };
        return parsed;
    }

    public parseVaultAccounts(
        accounts: Array<VaultStateInterface>
    ): Array<VaultStateParsed> {
        return accounts.map(
            (data: VaultStateInterface | VaultItemInterface | any) => {
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
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        return await this.program.methods
            .initializeVaultAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultTrackerAccount, this.authority])
            .rpc();
    }

    public async initCPI(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey
    ): Promise<any> {

        const resolvedAccounts: ResolvedAccounts = {
            vaultProgram: this.program.programId,
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        await this.debankProgram.methods
            .cpiInitializeVaultAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultAccount, this.authority])
            .rpc();

    }

    public async isInitialized(): Promise<boolean> {

        const vaultAccount = await this.debankProgram.account.vaultState.fetch(
            this.vaultAccountKey
        );
        return vaultAccount.initialized;

    }

};

export {
    VaultAccountClass,
    VaultState,
    VaultStateParsed,
    VaultStateInterface,
    VaultItemInterface,
};
