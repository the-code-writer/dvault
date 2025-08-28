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
pub struct TokenEvent {
    pub label: String,
    pub vault_account: Pubkey,
    pub user_account: Pubkey,
    pub auth_account: Pubkey,
    pub token_account: Pubkey,
}

#[account]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct TokenState {
    pub token_index: u64,            // 4 bytes (fixed size)
    pub token_count: u64,            // 4 bytes (fixed size)
    pub token_count: u64,                  // 4 bytes (fixed size)
    pub token_account: Pubkey,       // 32 bytes (fixed size)
    pub token_last_key: Pubkey,      // 32 bytes (fixed size)
    pub token_last_key: Pubkey,            // 32 bytes (fixed size)
    pub token_item_last_key: Pubkey, // 32 bytes (fixed size)
    pub token_current_index: u64,          // 4 bytes (fixed size)
    pub user_account: Pubkey,              // 32 bytes (fixed size)
    pub vault_account: Pubkey,             // 32 bytes (fixed size)
    pub authority: Pubkey,                 // 32 bytes (fixed size)
    pub created_at: i64,                   // 8 bytes
    pub updated_at: i64,                   // 8 bytes
}

#[derive(Accounts)]
pub struct TokenDerivedAccounts<'info> {

    #[account(init, payer = authority, space = 8 + 4 + 4 + 4 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 8 + 8 )]
    pub token_account: Account<'info, TokenState>,
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
pub struct CloseToken<'info> {
    #[account(mut, close = authority)]
    pub token_account: Account<'info, TokenState>,
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

impl TokenState {
    pub fn init(
        &mut self,
        authority_key: Pubkey,
        vault_account_key: Pubkey,
        user_account_key: Pubkey,
        token_account_key: Pubkey,
        token_item_key: Pubkey,
        token_last_key: Pubkey,
        token_index: u64,
    ) {
        self.set_authority(authority_key);
        self.set_vault_account(vault_account_key);
        self.set_user_account(user_account_key);
        self.set_token_account(token_account_key);
        self.set_token_item_last_key(token_item_key);
        self.set_token_last_key(token_last_key);
        self.set_token_index(token_index);
        self.set_token_count(0);
        self.set_token_count(0);
        self.set_token_current_index(0);
        self.set_timestamps();
    }
    
    pub fn get_token_index(&self) -> u64 {
        self.token_index
    }

    pub fn set_token_index(&mut self, token_index: u64) {
        self.token_index = token_index;
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

    pub fn get_token_account(&self) -> Pubkey {
        self.token_account
    }

    pub fn set_token_account(&mut self, token_account: Pubkey) {
        self.token_account = token_account;
    }

    pub fn get_token_last_key(&self) -> Pubkey {
        self.token_last_key
    }

    pub fn set_token_last_key(&mut self, token_last_key: Pubkey) {
        self.token_last_key = token_last_key;
    }

    pub fn get_token_last_key(&self) -> Pubkey {
        self.token_last_key
    }

    pub fn set_token_last_key(&mut self, token_last_key: Pubkey) {
        self.token_last_key = token_last_key;
    }

    pub fn get_token_item_last_key(&self) -> Pubkey {
        self.token_item_last_key
    }

    pub fn set_token_item_last_key(&mut self, token_item_last_key: Pubkey) {
        self.token_item_last_key = token_item_last_key;
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

pub fn initialize_token_account(
    ctx: Context<TokenDerivedAccounts>,
    token_item_key: Pubkey,
) -> Result<(Pubkey, Pubkey, Pubkey, Pubkey)> {

    let vault_tracker_account: &mut Account<VaultTrackerState> =
        &mut ctx.accounts.vault_tracker_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;

    if vault_account.is_token_initialized() {
        throw_err(
            ErrorType::VaultError,
            SysError::TokenAccountAlreadyExists,
        );
    }

    let token_account_key: Pubkey = token_account.key().clone();

    token_account.init(
        authority.key().clone(),
        vault_account.key().clone(),
        user_account.key().clone(),
        token_account_key,
        token_item_key.clone(),
        vault_account.get_token_last_key().clone(),
        vault_tracker_account.get_token_current_index().clone(),
    );

    vault_account.set_is_token_initialized(true);
    vault_account.set_token_last_key(token_account.key());
    vault_account.increament_token_count();
    user_account.increament_token_count();
    vault_tracker_account.increament_token_current_index();

    emit!(TokenEvent {
        label: "TXN.CREATE".to_string(),
        auth_account: authority.key().clone(),
        vault_account: vault_account.key().clone(),
        user_account: user_account.key().clone(),
        token_account: token_account.key().clone(),
    });

    Ok((authority.key(), vault_account.key(), user_account.key(), token_account.key()))

    
}

pub fn close_token(ctx: Context<CloseToken>) -> ProgramResult {
    let token_account: &mut Account<TokenState> =
        &mut ctx.accounts.token_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;
    let system_program: &mut Program<System> = &mut ctx.accounts.system_program;

    let rent = Rent::get().unwrap();
    let rent_lamports = rent.minimum_balance(token_account.to_account_info().data_len());

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

    // Check if the authority is the same as the token authority
    if *authority.key != token_account.authority {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidAuthority(
                authority.key().to_string(),
                token_account.get_authority().to_string(),
            ),
        );
    }

    // Check if the main token account has any tokens
    if token_account.token_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::TokenAccountHasExistingTokenItems(
                token_account.key().to_string(),
                token_account.get_token_count(),
            ),
        );
    }

    // Check if the token account has sufficient funds
    if token_account.to_account_info().lamports() < rent_lamports {
        throw_err(
            ErrorType::VaultError,
            SysError::InsufficientFundsRental(
                token_account.key().to_string(),
                rent_lamports,
                token_account.to_account_info().lamports(),
            ),
        );
    }

    vault_account.set_is_token_initialized(false);

    // Try to close the token account and transfer the lamports to the authority
    match token_account.close(authority.to_account_info()) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.into()),
    }
}


pub fn token_get_token_index(ctx: Context<TokenDerivedAccounts>) -> Result<u64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_index())
}

pub fn token_get_token_count(ctx: Context<TokenDerivedAccounts>) -> Result<u64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_count())
}

pub fn token_get_token_count(ctx: Context<TokenDerivedAccounts>) -> Result<u64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_count())
}

pub fn token_get_token_account(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_account())
}

pub fn token_get_token_last_key(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_last_key())
}

pub fn token_get_token_last_key(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_last_key())
}

pub fn token_get_token_item_last_key(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_item_last_key())
}

pub fn token_get_user_account(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_user_account())
}

pub fn token_get_token_current_index(ctx: Context<TokenDerivedAccounts>) -> Result<u64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_token_current_index())
}

pub fn token_get_vault_account(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_vault_account())
}

pub fn token_get_authority(ctx: Context<TokenDerivedAccounts>) -> Result<Pubkey> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_authority())
}

pub fn token_get_created_at(ctx: Context<TokenDerivedAccounts>) -> Result<i64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_created_at())
}

pub fn token_get_updated_at(ctx: Context<TokenDerivedAccounts>) -> Result<i64> {
    let token_account: &mut Account<TokenState> = &mut ctx.accounts.token_account;
    Ok(token_account.get_updated_at())
}

