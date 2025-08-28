use anchor_lang::prelude::*;

use anchor_lang::solana_program::entrypoint::ProgramResult;
use commons::throw_err;
use commons::ErrorType;
use commons::SysError;

//use crate::TokenAccountState;
use crate::UserState;
use crate::VaultState;
use crate::VaultTrackerState;

#[event]
pub struct TransactionEvent {
    pub label: String,
    pub vault_account: Pubkey,
    pub user_account: Pubkey,
    pub auth_account: Pubkey,
    pub transaction_account: Pubkey,
}

#[account]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct TransactionState {
    pub transaction_index: u64,            // 4 bytes (fixed size)
    pub transaction_count: u64,            // 4 bytes (fixed size)
    pub token_count: u64,                  // 4 bytes (fixed size)
    pub transaction_account: Pubkey,       // 32 bytes (fixed size)
    pub transaction_last_key: Pubkey,      // 32 bytes (fixed size)
    pub token_last_key: Pubkey,            // 32 bytes (fixed size)
    pub transaction_item_last_key: Pubkey, // 32 bytes (fixed size)
    pub token_current_index: u64,          // 4 bytes (fixed size)
    pub user_account: Pubkey,              // 32 bytes (fixed size)
    pub vault_account: Pubkey,             // 32 bytes (fixed size)
    pub authority: Pubkey,                 // 32 bytes (fixed size)
    pub created_at: i64,                   // 8 bytes
    pub updated_at: i64,                   // 8 bytes
}

#[derive(Accounts)]
pub struct TransactionDerivedAccounts<'info> {

    #[account(init, payer = authority, space = 8 + 4 + 4 + 4 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 8 + 8 )]
    pub transaction_account: Account<'info, TransactionState>,
    #[account(mut, has_one = authority)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
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
pub struct CloseTransaction<'info> {
    #[account(mut, close = authority)]
    pub transaction_account: Account<'info, TransactionState>,
    // #[account(mut)]
    // pub token_account: Account<'info, TokenAccountState>,
    #[account(mut)]
    pub user_account: Account<'info, UserState>,
    #[account(mut)]
    pub vault_account: Account<'info, VaultState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
 constraint = system_program.key() == anchor_lang::solana_program::system_program::ID
 )]
    pub system_program: Program<'info, System>,
}

impl TransactionState {
    pub fn init(
        &mut self,
        authority_key: Pubkey,
        vault_account_key: Pubkey,
        user_account_key: Pubkey,
        transaction_account_key: Pubkey,
        transaction_item_key: Pubkey,
        transaction_last_key: Pubkey,
        transaction_index: u64,
    ) {
        self.set_authority(authority_key);
        self.set_vault_account(vault_account_key);
        self.set_user_account(user_account_key);
        self.set_transaction_account(transaction_account_key);
        self.set_transaction_item_last_key(transaction_item_key);
        self.set_transaction_last_key(transaction_last_key);
        self.set_transaction_index(transaction_index);
        self.set_transaction_count(0);
        self.set_token_count(0);
        self.set_token_current_index(0);
        self.set_timestamps();
    }
    
    pub fn get_transaction_index(&self) -> u64 {
        self.transaction_index
    }

    pub fn set_transaction_index(&mut self, transaction_index: u64) {
        self.transaction_index = transaction_index;
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

    pub fn get_transaction_account(&self) -> Pubkey {
        self.transaction_account
    }

    pub fn set_transaction_account(&mut self, transaction_account: Pubkey) {
        self.transaction_account = transaction_account;
    }

    pub fn get_transaction_last_key(&self) -> Pubkey {
        self.transaction_last_key
    }

    pub fn set_transaction_last_key(&mut self, transaction_last_key: Pubkey) {
        self.transaction_last_key = transaction_last_key;
    }

    pub fn get_token_last_key(&self) -> Pubkey {
        self.token_last_key
    }

    pub fn set_token_last_key(&mut self, token_last_key: Pubkey) {
        self.token_last_key = token_last_key;
    }

    pub fn get_transaction_item_last_key(&self) -> Pubkey {
        self.transaction_item_last_key
    }

    pub fn set_transaction_item_last_key(&mut self, transaction_item_last_key: Pubkey) {
        self.transaction_item_last_key = transaction_item_last_key;
    }

    pub fn get_user_account(&self) -> Pubkey {
        self.user_account
    }

    pub fn set_user_account(&mut self, user_account: Pubkey) {
        self.user_account = user_account;
    }

    pub fn get_token_current_index(&self) -> u64 {
        self.token_current_index
    }

    pub fn set_token_current_index(&mut self, token_current_index: u64) {
        self.token_current_index = token_current_index;
    }

    pub fn increament_token_current_index(&mut self) {
        self.token_current_index = self.token_current_index + 1;
    }

    pub fn get_vault_account(&self) -> Pubkey {
        self.vault_account
    }

    pub fn set_vault_account(&mut self, vault_account: Pubkey) {
        self.vault_account = vault_account;
    }

    pub fn get_authority(&self) -> Pubkey {
        self.authority
    }

    pub fn set_authority(&mut self, authority: Pubkey) {
        self.authority = authority;
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

pub fn initialize_transaction_account(
    ctx: Context<TransactionDerivedAccounts>,
    transaction_item_key: Pubkey,
) -> Result<(Pubkey, Pubkey, Pubkey, Pubkey)> {

    let vault_tracker_account: &mut Account<VaultTrackerState> =
        &mut ctx.accounts.vault_tracker_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;

    if vault_account.is_transaction_initialized() {
        throw_err(
            ErrorType::VaultError,
            SysError::TransactionAccountAlreadyExists,
        );
    }

    let transaction_account_key: Pubkey = transaction_account.key().clone();

    transaction_account.init(
        authority.key().clone(),
        vault_account.key().clone(),
        user_account.key().clone(),
        transaction_account_key,
        transaction_item_key.clone(),
        vault_account.get_transaction_last_key().clone(),
        vault_tracker_account.get_transaction_current_index().clone(),
    );

    vault_account.set_is_transaction_initialized(true);
    vault_account.set_transaction_last_key(transaction_account.key());
    vault_account.increament_transaction_count();
    user_account.increament_transaction_count();
    vault_tracker_account.increament_transaction_current_index();

    emit!(TransactionEvent {
        label: "TXN.CREATE".to_string(),
        auth_account: authority.key().clone(),
        vault_account: vault_account.key().clone(),
        user_account: user_account.key().clone(),
        transaction_account: transaction_account.key().clone(),
    });

    Ok((authority.key(), vault_account.key(), user_account.key(), transaction_account.key()))

    
}

pub fn close_transaction(ctx: Context<CloseTransaction>) -> ProgramResult {
    let transaction_account: &mut Account<TransactionState> =
        &mut ctx.accounts.transaction_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;
    let system_program: &mut Program<System> = &mut ctx.accounts.system_program;

    let rent = Rent::get().unwrap();
    let rent_lamports = rent.minimum_balance(transaction_account.to_account_info().data_len());

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

    // Check if the authority is the same as the transaction authority
    if *authority.key != transaction_account.authority {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidAuthority(
                authority.key().to_string(),
                transaction_account.get_authority().to_string(),
            ),
        );
    }

    // Check if the main transaction account has any transactions
    if transaction_account.transaction_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::TransactionAccountHasExistingTransactionItems(
                transaction_account.key().to_string(),
                transaction_account.get_transaction_count(),
            ),
        );
    }

    // Check if the transaction account has sufficient funds
    if transaction_account.to_account_info().lamports() < rent_lamports {
        throw_err(
            ErrorType::VaultError,
            SysError::InsufficientFundsRental(
                transaction_account.key().to_string(),
                rent_lamports,
                transaction_account.to_account_info().lamports(),
            ),
        );
    }

    vault_account.set_is_transaction_initialized(false);

    // Try to close the transaction account and transfer the lamports to the authority
    match transaction_account.close(authority.to_account_info()) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.into()),
    }
}


pub fn transaction_get_transaction_index(ctx: Context<TransactionDerivedAccounts>) -> Result<u64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_transaction_index())
}

pub fn transaction_get_transaction_count(ctx: Context<TransactionDerivedAccounts>) -> Result<u64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_transaction_count())
}

pub fn transaction_get_token_count(ctx: Context<TransactionDerivedAccounts>) -> Result<u64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_token_count())
}

pub fn transaction_get_transaction_account(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_transaction_account())
}

pub fn transaction_get_transaction_last_key(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_transaction_last_key())
}

pub fn transaction_get_token_last_key(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_token_last_key())
}

pub fn transaction_get_transaction_item_last_key(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_transaction_item_last_key())
}

pub fn transaction_get_user_account(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_user_account())
}

pub fn transaction_get_token_current_index(ctx: Context<TransactionDerivedAccounts>) -> Result<u64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_token_current_index())
}

pub fn transaction_get_vault_account(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_vault_account())
}

pub fn transaction_get_authority(ctx: Context<TransactionDerivedAccounts>) -> Result<Pubkey> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_authority())
}

pub fn transaction_get_created_at(ctx: Context<TransactionDerivedAccounts>) -> Result<i64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_created_at())
}

pub fn transaction_get_updated_at(ctx: Context<TransactionDerivedAccounts>) -> Result<i64> {
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    Ok(transaction_account.get_updated_at())
}

