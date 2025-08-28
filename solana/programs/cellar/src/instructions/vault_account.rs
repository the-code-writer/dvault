use anchor_lang::{
    prelude::*,
    solana_program::entrypoint::ProgramResult,
};

use commons::throw_err;
use commons::ErrorType;
use commons::SysError;

use crate::VaultTrackerState;

#[event]
pub struct VaultEvent {
    pub label: String,
    pub authority: Pubkey,
    pub vault_account: Pubkey,
    pub name: String,
    pub description: String,
    pub rent: String,
    pub vault_tracker_account: Pubkey,
}

#[account]
pub struct VaultState {
    pub initialized: bool,             // 1 byte
    pub user_initialized: bool,        // 1 byte
    pub transaction_initialized: bool, // 1 byte
    pub vault_index: u64,              // 8 bytes (fixed size)
    pub name: String, // 16 * 4 = 64 ~ variable length (assuming 4 bytes per character)
    pub description: String, // 64 * 4 = 256 ~ variable length (assuming 4 bytes per character)
    pub vault_account: Pubkey, // 32 bytes (fixed size)
    pub authority: Pubkey, // 32 bytes (fixed size)
    pub vault_last_key: Pubkey, // 32 bytes (fixed size)
    pub user_last_key: Pubkey, // 32 bytes (fixed size)
    pub transaction_last_key: Pubkey, // 32 bytes (fixed size)
    pub transaction_count: u64, // 8 bytes (fixed size)
    pub token_count: u64, // 8 bytes (fixed size)
    pub user_count: u64, // 8 bytes (fixed size)
    pub created_at: i64, // 8 bytes (fixed size)
    pub updated_at: i64, // 8 bytes (fixed size)
}

#[derive(Accounts)]
pub struct VaultDerivedAccounts<'info> {
    #[account(init, payer = authority, space = 8 + 1 + 1 + 1 + 8 + 64 + 256 + 32 + 32 + 32 + 32 + 32 + 8 + 8 + 8 + 8 + 8)]
    pub vault_account: Account<'info, VaultState>,
    #[account(mut)]
    pub vault_tracker_account: Account<'info, VaultTrackerState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        constraint = system_program.key() == anchor_lang::solana_program::system_program::ID
    )]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseVault<'info> {
    #[account(mut, close = authority)]
    pub vault_account: Account<'info, VaultState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
 constraint = system_program.key() == anchor_lang::solana_program::system_program::ID
 )]
    pub system_program: Program<'info, System>,
}

impl VaultState {
    pub fn new(
        initialized: bool,
        user_initialized: bool,
        transaction_initialized: bool,
        vault_index: u64,
        name: String,
        description: String,
        vault_account: Pubkey,
        authority: Pubkey,
        vault_last_key: Pubkey,
        user_last_key: Pubkey,
        transaction_last_key: Pubkey,
        transaction_count: u64,
        token_count: u64,
        user_count: u64,
        created_at: i64,
        updated_at: i64,
    ) -> Self {
        VaultState {
            initialized,
            user_initialized,
            transaction_initialized,
            vault_index,
            name,
            description,
            vault_account,
            authority,
            vault_last_key,
            user_last_key,
            transaction_last_key,
            transaction_count,
            token_count,
            user_count,
            created_at,
            updated_at,
        }
    }

    pub fn init(
        &mut self,
        authority: Pubkey,
        vault_account_key: Pubkey,
        name: String,
        description: String,
        vault_current_index: u64,
        vault_last_key: Pubkey,
        user_last_key: Pubkey,
        transaction_last_key: Pubkey,
    ) {
        self.set_authority(authority);
        self.set_vault_account(vault_account_key);
        self.set_name(name);
        self.set_description(description);
        self.set_vault_index(vault_current_index);
        self.set_vault_last_key(vault_last_key);
        self.set_user_last_key(user_last_key);
        self.set_transaction_last_key(transaction_last_key);
        self.set_user_count(0);
        self.set_transaction_count(0);
        self.set_token_count(0);
        self.set_timestamps();
        self.set_is_initialized(true);
    }

    pub fn is_initialized(&self) -> bool {
        self.initialized
    }

    pub fn set_is_initialized(&mut self, value: bool) {
        self.initialized = value;
    }

    pub fn get_vault_index(&self) -> u64 {
        self.vault_index
    }

    pub fn set_vault_index(&mut self, vault_index: u64) {
        self.vault_index = vault_index;
    }

    pub fn get_name(&self) -> &String {
        &self.name
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn get_description(&self) -> &String {
        &self.description
    }

    pub fn set_description(&mut self, description: String) {
        self.description = description;
    }

    pub fn get_vault_account(&self) -> &Pubkey {
        &self.vault_account
    }

    pub fn set_vault_account(&mut self, vault_account: Pubkey) {
        self.vault_account = vault_account;
    }

    pub fn get_authority(&self) -> &Pubkey {
        &self.authority
    }

    pub fn set_authority(&mut self, authority: Pubkey) {
        self.authority = authority;
    }

    pub fn get_vault_last_key(&self) -> &Pubkey {
        &self.vault_last_key
    }

    pub fn set_vault_last_key(&mut self, vault_last_key: Pubkey) {
        self.vault_last_key = vault_last_key;
    }

    pub fn get_user_last_key(&self) -> &Pubkey {
        &self.user_last_key
    }

    pub fn set_user_last_key(&mut self, user_last_key: Pubkey) {
        self.user_last_key = user_last_key;
    }

    pub fn get_transaction_last_key(&self) -> &Pubkey {
        &self.transaction_last_key
    }

    pub fn set_transaction_last_key(&mut self, transaction_last_key: Pubkey) {
        self.transaction_last_key = transaction_last_key;
    }

    pub fn get_transaction_count(&self) -> u64 {
        self.transaction_count
    }

    pub fn set_transaction_count(&mut self, transaction_count: u64) {
        self.transaction_count = transaction_count;
    }

    pub fn increament_transaction_count(&mut self) {
        self.transaction_count = self.transaction_count + 1;
    }

    pub fn decreament_transaction_count(&mut self) {
        if self.transaction_count > 0 {
            self.transaction_count = self.transaction_count - 1;
        }
    }

    pub fn is_transaction_initialized(&mut self) -> bool {
        self.transaction_count > 0 && self.transaction_initialized
    }

    pub fn set_is_transaction_initialized(&mut self, value: bool) {
        self.transaction_initialized = value;
    }

    pub fn get_token_count(&self) -> u64 {
        self.token_count
    }

    pub fn set_token_count(&mut self, token_count: u64) {
        self.token_count = token_count;
    }

    pub fn increament_token_count(&mut self) {
        self.token_count = self.token_count + 1;
    }

    pub fn decreament_token_count(&mut self) {
        if self.token_count > 0 {
            self.token_count = self.token_count - 1;
        }
    }

    pub fn get_user_count(&self) -> u64 {
        self.user_count
    }

    pub fn set_user_count(&mut self, user_count: u64) {
        self.user_count = user_count;
    }

    pub fn increment_user_count(&mut self) {
        self.user_count = self.user_count + 1;
    }

    pub fn decrement_user_count(&mut self) {
        if self.user_count > 0 {
            self.user_count = self.user_count - 1;
        }
    }

    pub fn is_user_initialized(&self) -> bool {
        self.user_count > 1 && self.user_initialized
    }

    pub fn set_is_user_initialized(&mut self, value: bool) {
        self.user_initialized = value;
    }

    pub fn get_created_at(&self) -> i64 {
        self.created_at
    }

    pub fn set_created_at(&mut self, created_at: i64) {
        self.created_at = created_at;
    }

    pub fn get_updated_at(&self) -> i64 {
        self.updated_at
    }

    pub fn set_updated_at(&mut self, updated_at: i64) {
        self.updated_at = updated_at;
    }

    pub fn set_timestamps(&mut self) {
        self.created_at = Clock::get().unwrap().unix_timestamp;
        self.updated_at = Clock::get().unwrap().unix_timestamp;
    }
}

pub fn initialize_vault_account(
    ctx: Context<VaultDerivedAccounts>,
    transaction_initial_key: Pubkey,
    name: String,
    description: String,
) -> Result<(String, String, Pubkey, Pubkey, Pubkey)> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let vault_tracker_account: &mut Account<VaultTrackerState> =
        &mut ctx.accounts.vault_tracker_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;

    let vault_account_key: Pubkey = vault_account.key().clone();

    if vault_tracker_account.is_initialized() {
        throw_err(
            ErrorType::VaultError,
            SysError::VaultAccountAlreadyExists(vault_account_key.to_string().clone()),
        );
    }

    if name.is_empty() {
        throw_err(ErrorType::VaultError, SysError::EmptyName);
    }

    if name.len() > 32 {
        throw_err(ErrorType::VaultError, SysError::LongName);
    }

    if description.is_empty() {
        throw_err(ErrorType::VaultError, SysError::EmptyDescription);
    }

    if description.len() > 64 {
        throw_err(ErrorType::VaultError, SysError::LongDescription);
    }

    vault_account.init(
        authority.key(),
        vault_account_key.clone(),
        name.clone(),
        description.clone(),
        vault_tracker_account.get_vault_current_index().clone(),
        vault_tracker_account.get_vault_last_key().clone(),
        vault_tracker_account.get_user_last_key().clone(),
        transaction_initial_key,
    );

    vault_tracker_account.increament_vault_current_index();
    vault_tracker_account.set_vault_last_key(vault_account.key().clone());

    let rent: Rent = Rent::get().unwrap();
    let rent_lamports: u64 = rent.minimum_balance(vault_account.to_account_info().data_len());

    emit!(VaultEvent {
        label: "VLT.CREATE".to_string(),
        name: name.clone(),
        description: description.clone(),
        rent: rent_lamports.to_string(),
        authority: authority.key().clone(),
        vault_account: vault_account.key().clone(),
        vault_tracker_account: vault_tracker_account.key().clone(),
    });

    Ok((
        name.to_string(),
        description.to_string(),
        authority.key(),
        vault_account.key(),
        vault_tracker_account.key(),
    ))
}

pub fn close_vault(ctx: Context<CloseVault>) -> ProgramResult {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;
    let system_program: &mut Program<System> = &mut ctx.accounts.system_program;

    let rent: Rent = Rent::get().unwrap();
    let rent_lamports: u64 = rent.minimum_balance(vault_account.to_account_info().data_len());

    // Check if the program is the same as the system program
    if *system_program.key != anchor_lang::solana_program::system_program::ID {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidProgramID(
                system_program.key().to_string(),
                anchor_lang::solana_program::system_program::ID.to_string(),
            ),
        );
    }

    // Check if the authority is the same as the vault authority
    if *authority.key != vault_account.authority {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidAuthority(
                authority.key().to_string(),
                vault_account.get_authority().to_string(),
            ),
        );
    }

    // Check if the vault has any users
    if vault_account.user_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::VaultAccountHasExistingUsers(
                vault_account.key().to_string(),
                vault_account.user_count,
            ),
        );
    }

    // Check if the vault has any transactions
    if vault_account.transaction_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::VaultAccountHasExistingTransactions(
                vault_account.key().to_string(),
                vault_account.transaction_count,
            ),
        );
    }

    // Check if the vault has any tokens
    if vault_account.token_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::VaultAccountHasExistingTokens(
                vault_account.key().to_string(),
                vault_account.token_count,
            ),
        );
    }

    // Check if the vault account has sufficient funds
    if vault_account.to_account_info().lamports() < rent_lamports {
        throw_err(
            ErrorType::VaultError,
            SysError::InsufficientFundsRental(
                vault_account.key().to_string(),
                rent_lamports,
                vault_account.to_account_info().lamports(),
            ),
        );
    }

    // Try to close the vault account and transfer the lamports to the authority
    match vault_account.close(authority.to_account_info()) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.into()),
    }
}

pub fn vault_is_initialized(ctx: Context<VaultDerivedAccounts>) -> Result<bool> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.is_initialized())
}

pub fn vault_get_vault_index(ctx: Context<VaultDerivedAccounts>) -> Result<u64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_vault_index())
}

pub fn vault_get_name(ctx: Context<VaultDerivedAccounts>) -> Result<String> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_name().to_string())
}

pub fn vault_get_description(ctx: Context<VaultDerivedAccounts>) -> Result<String> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_description().to_string())
}

pub fn vault_get_vault_account(ctx: Context<VaultDerivedAccounts>) -> Result<Pubkey> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(*vault_account.get_vault_account())
}

pub fn vault_get_authority(ctx: Context<VaultDerivedAccounts>) -> Result<Pubkey> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(*vault_account.get_authority())
}

pub fn vault_get_vault_last_key(ctx: Context<VaultDerivedAccounts>) -> Result<Pubkey> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(*vault_account.get_vault_last_key())
}

pub fn vault_get_user_last_key(ctx: Context<VaultDerivedAccounts>) -> Result<Pubkey> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(*vault_account.get_user_last_key())
}

pub fn vault_get_transaction_last_key(ctx: Context<VaultDerivedAccounts>) -> Result<Pubkey> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(*vault_account.get_transaction_last_key())
}

pub fn vault_get_transaction_count(ctx: Context<VaultDerivedAccounts>) -> Result<u64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_transaction_count())
}

pub fn vault_is_transaction_initialized(ctx: Context<VaultDerivedAccounts>) -> Result<bool> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.is_transaction_initialized())
}

pub fn vault_get_token_count(ctx: Context<VaultDerivedAccounts>) -> Result<u64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_token_count())
}

pub fn vault_get_user_count(ctx: Context<VaultDerivedAccounts>) -> Result<u64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_user_count())
}

pub fn vault_is_user_initialized(ctx: Context<VaultDerivedAccounts>) -> Result<u64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_user_count())
}

pub fn vault_get_created_at(ctx: Context<VaultDerivedAccounts>) -> Result<i64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_created_at())
}

pub fn vault_get_updated_at(ctx: Context<VaultDerivedAccounts>) -> Result<i64> {
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    Ok(vault_account.get_updated_at())
}
