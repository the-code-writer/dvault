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

interface VaultTrackerState {
    vault_current_index: number;
    vault_tracker_account: string;
    vault_last_key: string;
    user_current_index: number;
    user_last_key: string;
    transaction_current_index: number;
    initialized: boolean;
}

interface VaultTrackerStateParsed {
    publicKey?: string;
    vaultCurrentIndex: number;
    vaultTrackerAccountKey: string;
    vaultLastKey: string;
    userCurrentIndex: number;
    userLastKey: string;
    transactionCurrentIndex: number;
    initialized: boolean;
}

interface VaultTrackerItemInterface {
    vaultCurrentIndex: anchor.BN;
    vaultTrackerAccountKey: anchor.web3.PublicKey;
    vaultLastKey: anchor.web3.PublicKey;
    userCurrentIndex: anchor.BN;
    userLastKey: anchor.web3.PublicKey;
    transactionCurrentIndex: anchor.BN;
    initialized: boolean;
}

interface VaultTrackerStateInterface {
    publicKey: anchor.web3.PublicKey;
    account: VaultTrackerItemInterface;
}

const ConfidentialTransfersClass = class {

    program: anchor.Program<Cellar>;

    debankProgram: anchor.Program<Debank>;

    vaultTrackerAccount: any;

    vaultTrackerAccountKey: anchor.web3.PublicKey;

    authority: any;

    authorityKey: anchor.web3.PublicKey;

    public init(vaultTrackerAccount: any, authority: any): void {

        this.program = anchor.workspace.Cellar as Program<Cellar>;

        this.debankProgram = anchor.workspace.Debank as Program<Debank>;

        this.vaultTrackerAccount = vaultTrackerAccount;

        this.vaultTrackerAccountKey = vaultTrackerAccount.publicKey;

        this.authority = authority;

        this.authorityKey = authority.publicKey;
    }

    public async all(): Promise<VaultTrackerStateParsed[]> {
        const vaultTrackerStateAccounts: Array<VaultTrackerStateInterface> =
            await this.program.account.vaultTrackerState.all();

        const parsedVaultTrackerStateAccounts: Array<VaultTrackerStateParsed> =
            this.parseConfidentialTransferss(vaultTrackerStateAccounts);

        return parsedVaultTrackerStateAccounts;
    }

    public async fetch(
        publicKey: string
    ): Promise<VaultTrackerStateParsed> {
        const vaultTrackerStateAccount: VaultTrackerItemInterface =
            await this.program.account.vaultTrackerState.fetch(publicKey);

        const parsedVaultTrackerStateAccount: VaultTrackerStateParsed =
            this.parseItem(vaultTrackerStateAccount);

        return parsedVaultTrackerStateAccount;
    }

    public async fetchMultiple(
        publicKeys: Array<string>
    ): Promise<VaultTrackerStateParsed[]> {
        const vaultTrackerStateAccounts: any =
            await this.program.account.vaultTrackerState.fetchMultiple(publicKeys);

        const parsedVaultTrackerStateAccounts: Array<VaultTrackerStateParsed> =
            this.parseConfidentialTransferss(vaultTrackerStateAccounts);

        return parsedVaultTrackerStateAccounts;
    }

    public toString(accounts: Array<VaultTrackerStateInterface>): string {
        return JSON.stringify(this.parseConfidentialTransferss(accounts));
    }

    public parse(
        account: VaultTrackerItemInterface,
        publicKey: anchor.web3.PublicKey = null
    ): VaultTrackerStateParsed {
        const parsed: VaultTrackerStateParsed = {
            vaultCurrentIndex: account.vaultCurrentIndex.toNumber(),
            vaultTrackerAccountKey: account.vaultTrackerAccountKey.toString(),
            vaultLastKey: account.vaultLastKey.toString(),
            userCurrentIndex: account.userCurrentIndex.toNumber(),
            userLastKey: account.userLastKey.toString(),
            transactionCurrentIndex: account.transactionCurrentIndex.toNumber(),
            initialized: account.initialized,
        };
        if (publicKey) {
            parsed.publicKey = publicKey.toString();
        }
        return parsed;
    }

    public parseItem(
        account: VaultTrackerItemInterface
    ): VaultTrackerStateParsed {
        const parsed: VaultTrackerStateParsed = {
            vaultCurrentIndex: account.vaultCurrentIndex.toNumber(),
            vaultTrackerAccountKey: account.vaultTrackerAccountKey.toString(),
            vaultLastKey: account.vaultLastKey.toString(),
            userCurrentIndex: account.userCurrentIndex.toNumber(),
            userLastKey: account.userLastKey.toString(),
            transactionCurrentIndex: account.transactionCurrentIndex.toNumber(),
            initialized: account.initialized,
        };
        return parsed;
    }

    public parseConfidentialTransferss(
        accounts: Array<VaultTrackerStateInterface>
    ): Array<VaultTrackerStateParsed> {
        return accounts.map(
            (data: VaultTrackerStateInterface | VaultTrackerItemInterface | any) => {
                if (data.hasOwnProperty("publicKey")) {
                    return this.parse(data?.account, data.publicKey);
                } else {
                    return this.parse(data, undefined);
                }
            }
        );
    }

    public async initializeConfidentialTransfers(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey
    ): Promise<any> {
        const resolvedAccounts: ResolvedAccounts = {
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        return await this.program.methods
            .initializeConfidentialTransfers(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultTrackerAccount, this.authority])
            .rpc();
    }

    public async cpiInitializeConfidentialTransfers(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey
    ): Promise<any> {

        const resolvedAccounts2: ResolvedAccounts = {
            vaultProgram: this.program.programId,
            vaultTrackerAccount: this.vaultTrackerAccountKey,
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        await this.debankProgram.methods
            .bankInitializeConfidentialTransfers(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts2)
            .signers([this.vaultTrackerAccount, this.authority])
            .rpc();

    }

    public async isInitialized(): Promise<boolean> {

        const vaultTrackerAccount = await this.debankProgram.account.vaultTrackerState.fetch(
            this.vaultTrackerAccountKey
        );
        return vaultTrackerAccount.initialized;

    }

};

export {
    ConfidentialTransfersClass,
    VaultTrackerState,
    VaultTrackerStateParsed,
    VaultTrackerStateInterface,
    VaultTrackerItemInterface,
};
