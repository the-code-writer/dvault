import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Cellar } from "../../target/types/cellar";
import { Debank } from "../../target/types/debank";
import { PublicKey } from "@solana/web3.js";
import { publicKey } from '@solana/buffer-layout-utils';

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

const VaultTrackerAccountClass = class {

    program: anchor.Program<Cellar>;

    debankProgram: anchor.Program<Debank>;

    vaultTrackerAccount: any;

    vaultTrackerAccountKey: anchor.web3.PublicKey;

    authority: any;

    authorityKey: anchor.web3.PublicKey;

    debankPDA;

    debankBump;

    eventSubscriptionID;

    constructor(vaultTrackerAccount: any, authority: any) {

        this.setup(vaultTrackerAccount, authority);
    }

    public async setup(vaultTrackerAccount: any, authority: any): Promise<any> {

        this.program = anchor.workspace.Cellar as Program<Cellar>;

        this.debankProgram = anchor.workspace.Debank as Program<Debank>;

        this.vaultTrackerAccount = vaultTrackerAccount;

        this.vaultTrackerAccountKey = vaultTrackerAccount.publicKey;

        this.authority = authority;

        this.authorityKey = authority.publicKey;

        const [debankPDA, debankBump] = await PublicKey.findProgramAddressSync([], this.debankProgram.programId);

        this.debankPDA = debankPDA;

        this.debankBump = debankBump;

        const resolvedAccounts: ResolvedAccounts = {
            vaultProgram: this.program.programId,
            vaultTrackerAccount: vaultTrackerAccount.publicKey,
            authority: authority.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };
        
    }

    public async all(): Promise<VaultTrackerStateParsed[]> {
        const vaultTrackerStateAccounts: Array<VaultTrackerStateInterface> =
            await this.program.account.vaultTrackerState.all();

        const parsedVaultTrackerStateAccounts: Array<VaultTrackerStateParsed> =
            this.parseVaultTrackerAccounts(vaultTrackerStateAccounts);

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
            this.parseVaultTrackerAccounts(vaultTrackerStateAccounts);

        return parsedVaultTrackerStateAccounts;
    }

    public toString(accounts: Array<VaultTrackerStateInterface>): string {
        return JSON.stringify(this.parseVaultTrackerAccounts(accounts));
    }

    public parse(
        account: VaultTrackerItemInterface,
        publicKey: anchor.web3.PublicKey = null
    ): VaultTrackerStateParsed {
        const parsed: VaultTrackerStateParsed = this.parseItem(account);
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

    public parseVaultTrackerAccounts(
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

    public async init(
        vaultInitialKey: anchor.web3.PublicKey,
        userInitialKey: anchor.web3.PublicKey,
        callbackonEvent: any,
        vaultTrackerKeypair: anchor.web3.Keypair,
    ): Promise<any> {

        const resolvedAccounts: ResolvedAccounts = {
            vaultTrackerAccount: (vaultTrackerKeypair === null ? this.vaultTrackerAccountKey : vaultTrackerKeypair.publicKey),
            authority: this.authorityKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        };

        this.eventSubscriptionID = this.program.addEventListener("vaultTrackerEvent", (event, slot) => {
            callbackonEvent(event, slot);
        });

        return await this.program.methods
            .initializeVaultTrackerAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([(vaultTrackerKeypair === null ? this.vaultTrackerAccount : vaultTrackerKeypair), this.authority])
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
    VaultTrackerAccountClass,
    VaultTrackerState,
    VaultTrackerStateParsed,
    VaultTrackerStateInterface,
    VaultTrackerItemInterface,
};
