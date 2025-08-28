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

interface TokenState {
    initialized: boolean;
    user_index: number;
    name: string;
    balance: number;
    token_count: number;
    token_count: number;
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

interface TokenStateParsed {
    publicKey?: string;
    initialized: boolean;
    userIndex: number;
    name: string;
    balance: number;
    tokenCount: number;
    tokenCount: number;
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

interface TokenItemInterface {
    initialized: boolean;
    userIndex: anchor.BN;
    name: string;
    balance: anchor.BN;
    tokenCount: anchor.BN;
    tokenCount: anchor.BN;
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

interface TokenStateInterface {
    publicKey: anchor.web3.PublicKey;
    account: TokenItemInterface;
}

const TokenAccountClass = class {

    program: anchor.Program<Cellar>;

    debankProgram: anchor.Program<Debank>;

    vaultTrackerAccount: any;

    vaultTrackerAccountKey: anchor.web3.PublicKey;

    vaultAccount: any;

    vaultAccountKey: anchor.web3.PublicKey;

    userAccount: any;

    userAccountKey: anchor.web3.PublicKey;

    tokenAccount: any;

    tokenAccountKey: anchor.web3.PublicKey;

    authority: any;

    authorityKey: anchor.web3.PublicKey;

    public constructor(vaultTrackerAccount: any, vaultAccount: any, userAccount: any, tokenAccount: any, authority: any) {

        this.setup(vaultTrackerAccount, vaultAccount, userAccount, tokenAccount, authority);

    }

    public setup(vaultTrackerAccount: any, vaultAccount: any, userAccount: any, tokenAccount: any, authority: any): void {

        this.program = anchor.workspace.Cellar as Program<Cellar>;

        this.debankProgram = anchor.workspace.Debank as Program<Debank>;

        this.vaultTrackerAccount = vaultTrackerAccount;

        this.vaultTrackerAccountKey = vaultTrackerAccount.publicKey;

        this.vaultAccount = vaultAccount;

        this.vaultAccountKey = vaultAccount.publicKey;

        this.userAccount = userAccount;

        this.userAccountKey = userAccount.publicKey;

        this.tokenAccount = tokenAccount;

        this.tokenAccountKey = tokenAccount.publicKey;

        this.authority = authority;

        this.authorityKey = authority.publicKey;
    }

    public async all(): Promise<TokenStateParsed[]> {
        const tokenStateAccounts: Array<TokenStateInterface> =
            await this.program.account.tokenState.all();

        const parsedTokenStateAccounts: Array<TokenStateParsed> =
            this.parseTokenAccounts(tokenStateAccounts);

        return parsedTokenStateAccounts;
    }

    public async fetch(
        publicKey: string
    ): Promise<TokenStateParsed> {
        const tokenStateAccount: TokenItemInterface =
            await this.program.account.tokenState.fetch(publicKey);

        const parsedTokenStateAccount: TokenStateParsed =
            this.parseItem(tokenStateAccount);

        return parsedTokenStateAccount;
    }

    public async fetchMultiple(
        publicKeys: Array<string>
    ): Promise<TokenStateParsed[]> {
        const tokenStateAccounts: any =
            await this.program.account.tokenState.fetchMultiple(publicKeys);

        const parsedTokenStateAccounts: Array<TokenStateParsed> =
            this.parseTokenAccounts(tokenStateAccounts);

        return parsedTokenStateAccounts;
    }

    public toString(accounts: Array<TokenStateInterface>): string {
        return JSON.stringify(this.parseTokenAccounts(accounts));
    }

    public parse(
        account: TokenItemInterface,
        publicKey: anchor.web3.PublicKey = null
    ): TokenStateParsed {
        const parsed: TokenStateParsed = this.parseItem(account);
        if (publicKey) {
            parsed.publicKey = publicKey.toString();
        }
        return parsed;
    }

    public parseItem(
        account: TokenItemInterface
    ): TokenStateParsed {
        const parsed: TokenStateParsed = {
            initialized: account.initialized,
            userIndex: account.userIndex.toNumber(),
            name: account.name.toString(),
            balance: account.balance.toNumber(),
            tokenCount: account.tokenCount.toNumber(),
            tokenCount: account.tokenCount.toNumber(),
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

    public parseTokenAccounts(
        accounts: Array<TokenStateInterface>
    ): Array<TokenStateParsed> {
        return accounts.map(
            (data: TokenStateInterface | TokenItemInterface | any) => {
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
            .initializeTokenAccount(vaultInitialKey, userInitialKey)
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
            .cpiInitializeTokenAccount(vaultInitialKey, userInitialKey)
            .accounts(resolvedAccounts)
            .signers([this.vaultTrackerAccount, this.vaultAccount, this.userAccount, this.authority])
            .rpc();

    }

    public async isInitialized(): Promise<boolean> {

        const userAccount = await this.debankProgram.account.tokenState.fetch(
            this.userAccountKey
        );
        return userAccount.initialized;

    }

};

export {
    TokenAccountClass,
    TokenState,
    TokenStateParsed,
    TokenStateInterface,
    TokenItemInterface,
};
