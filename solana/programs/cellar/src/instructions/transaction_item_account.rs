use anchor_lang::prelude::*;

use commons::throw_err;
use commons::ErrorType;
use commons::SysError;

//use crate::TokenAccountState;
use crate::TransactionState;
use crate::UserState;
use crate::VaultState;

#[event]
pub struct TransactionItemEvent {
    pub label: String,
    pub vault_account: Pubkey,
    pub user_account: Pubkey,
    pub auth_account: Pubkey,
    pub transaction_account: Pubkey,
    pub transaction_item_account: Pubkey,
    pub from_account: Pubkey,
    pub to_account: Pubkey,
    pub amount: u64,
    pub token: Pubkey,
    pub payload: String,
}

#[account]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct TransactionItemState {
    pub from_account: Pubkey,
    pub to_account: Pubkey,
    pub amount: u64,
    pub token: Pubkey,
    pub description: String,
    pub transaction_type: String,
    pub payload: String,
    pub transaction_status: u8,
    pub transaction_item_last_key: Pubkey,
    pub transaction_item_account: Pubkey,
    pub transaction_account: Pubkey,
    pub user_account: Pubkey,
    pub created_at: i64,
    pub updated_at: i64,
}

#[derive(Accounts)]
pub struct TransactionItemDerivedAccounts<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 32 + 8 + 32 + 256 + 64 + 8 + 32 + 32 + 32 + 32 + 8 + 8)]
    pub transaction_item_account: Account<'info, TransactionItemState>,
    // #[account(mut)]
    // pub token_account: Account<'info, TokenAccountState>,
    #[account(mut)]
    pub transaction_account: Account<'info, TransactionState>,
    #[account(mut, has_one = authority)]
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

#[derive(Accounts)]
pub struct CloseTransactionItem<'info> {
    #[account(mut, close = authority)]
    pub transaction_item_account: Account<'info, TransactionItemState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
 constraint = system_program.key() == anchor_lang::solana_program::system_program::ID
 )]
    pub system_program: Program<'info, System>,
}


impl TransactionItemState {
    
    pub fn new(
        from_account: Pubkey,
        to_account: Pubkey,
        amount: u64,
        token: Pubkey,
        description: String,
        transaction_type: String,
        payload: String,
        transaction_status: u8,
        transaction_item_last_key: Pubkey,
        transaction_item_account: Pubkey,
        transaction_account: Pubkey,
        user_account: Pubkey,
        created_at: i64,
        updated_at: i64,
    ) -> Self {
        TransactionItemState {
            from_account,
            to_account,
            amount,
            token,
            description,
            transaction_type,
            payload,
            transaction_status,
            transaction_item_last_key,
            transaction_item_account,
            transaction_account,
            user_account,
            created_at,
            updated_at,
        }
    }

    pub fn init(
        &mut self,
        transaction_account: Pubkey,
        transaction_item_account: Pubkey,
        transaction_item_last_key: Pubkey,
    ) {
        self.set_transaction_account(transaction_account);
        self.set_transaction_item_account(transaction_item_account);
        self.set_transaction_item_last_key(transaction_item_last_key);
    }

    pub fn get_from_account(&self) -> Pubkey {
        self.from_account
    }

    pub fn set_from_account(&mut self, from_account: Pubkey) {
        self.from_account = from_account;
    }

    pub fn get_to_account(&self) -> Pubkey {
        self.to_account
    }

    pub fn set_to_account(&mut self, to_account: Pubkey) {
        self.to_account = to_account;
    }

    pub fn get_amount(&self) -> u64 {
        self.amount
    }

    pub fn set_amount(&mut self, amount: u64) {
        self.amount = amount;
    }

    pub fn get_token(&self) -> Pubkey {
        self.token
    }

    pub fn set_token(&mut self, token: Pubkey) {
        self.token = token;
    }

    pub fn get_description(&self) -> String {
        self.description.to_string()
    }

    pub fn set_description(&mut self, description: String) {
        self.description = description;
    }

    pub fn get_transaction_type(&self) -> String {
        self.transaction_type.to_string()
    }

    pub fn set_transaction_type(&mut self, transaction_type: String) {
        self.transaction_type = transaction_type;
    }

    pub fn get_payload(&self) -> String {
        self.payload.to_string()
    }

    pub fn set_payload(&mut self, payload: String) {
        self.payload = payload;
    }

    pub fn get_transaction_status(&self) -> u8 {
        self.transaction_status
    }

    pub fn set_transaction_status(&mut self, transaction_status: u8) {
        self.transaction_status = transaction_status;
    }

    pub fn get_transaction_item_last_key(&self) -> Pubkey {
        self.transaction_item_last_key
    }

    pub fn set_transaction_item_last_key(&mut self, transaction_item_last_key: Pubkey) {
        self.transaction_item_last_key = transaction_item_last_key;
    }

    pub fn get_transaction_item_account(&self) -> Pubkey {
        self.transaction_item_account
    }

    pub fn set_transaction_item_account(&mut self, transaction_item_account: Pubkey) {
        self.transaction_item_account = transaction_item_account;
    }

    pub fn get_transaction_account(&self) -> Pubkey {
        self.transaction_account
    }

    pub fn set_transaction_account(&mut self, transaction_account: Pubkey) {
        self.transaction_account = transaction_account;
    }

    pub fn get_user_account(&self) -> Pubkey {
        self.user_account
    }

    pub fn set_user_account(&mut self, user_account: Pubkey) {
        self.user_account = user_account;
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

pub fn initialize_transaction_item_account(
    ctx: Context<TransactionItemDerivedAccounts>,
    _transaction_item_key: Pubkey,
    _transaction_payload: String,
) -> Result<(Pubkey, Pubkey, Pubkey, Pubkey, Pubkey, String)> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    let transaction_account: &mut Account<TransactionState> = &mut ctx.accounts.transaction_account;
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;

    let transaction_account_key: Pubkey = transaction_account.key().clone();
    let transaction_item_account_key: Pubkey = transaction_item_account.key().clone();

    transaction_item_account.init(
        transaction_account_key,
        transaction_item_account_key,
        transaction_account.get_transaction_item_last_key().clone(),
    );

    transaction_item_account.set_transaction_status(0);

    let transaction_account_key: Pubkey = transaction_account.key().clone();
    
    transaction_account.set_transaction_last_key(transaction_account_key);
    transaction_account.increament_transaction_count();
    user_account.increament_transaction_count();
    vault_account.increament_transaction_count();

    // Deserialize the transaction payload

    let from_account: Pubkey = Pubkey::new_unique();
    let to_account: Pubkey = Pubkey::new_unique();
    let amount: u64 = 133557;
    let token: Pubkey = Pubkey::new_unique();
    let payload: String = "PAYLOAD".to_string();

    throw_err(
        ErrorType::VaultError,
        SysError::TransactionItemAccountPayloadMissing,
    );

    // Switch transaction_type: 

    // Deposit

    // Send

    // Transfer

    // Claim

    // Withdraw

    // Statememnt

    transaction_item_account.set_transaction_status(0);

    emit!(TransactionItemEvent {
        label: "TXN.ITEM.CREATE".to_string(),
        vault_account: vault_account.key().clone(),
        user_account: user_account.key().clone(),
        auth_account: authority.key().clone(),
        transaction_account: transaction_account.key().clone(),
        transaction_item_account: transaction_item_account.key().clone(),
        from_account: from_account,
        to_account: to_account,
        amount: amount,
        token: token,
        payload: payload.clone(),
    });
    
    Ok((
        authority.key(),
        vault_account.key(),
        user_account.key(),
        transaction_account.key(),
        transaction_item_account.key(),
        payload
    ))

}

pub fn transaction_item_get_from_account(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_from_account())
}

pub fn transaction_item_get_to_account(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_to_account())
}

pub fn transaction_item_get_amount(ctx: Context<TransactionItemDerivedAccounts>) -> Result<u64> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_amount())
}

pub fn transaction_item_get_token(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_token())
}

pub fn transaction_item_get_description(ctx: Context<TransactionItemDerivedAccounts>) -> Result<String> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_description())
}

pub fn transaction_item_get_transaction_type(ctx: Context<TransactionItemDerivedAccounts>) -> Result<String> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_transaction_type())
}

pub fn transaction_item_get_payload(ctx: Context<TransactionItemDerivedAccounts>) -> Result<String> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_payload())
}

pub fn transaction_item_get_transaction_status(ctx: Context<TransactionItemDerivedAccounts>) -> Result<u8> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_transaction_status())
}

pub fn transaction_item_get_transaction_item_last_key(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_transaction_item_last_key())
}

pub fn transaction_item_get_transaction_item_account(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_transaction_item_account())
}

pub fn transaction_item_get_transaction_account(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_transaction_account())
}

pub fn transaction_item_get_user_account(ctx: Context<TransactionItemDerivedAccounts>) -> Result<Pubkey> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_user_account())
}

pub fn transaction_item_get_created_at(ctx: Context<TransactionItemDerivedAccounts>) -> Result<i64> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_created_at())
}

pub fn transaction_item_get_updated_at(ctx: Context<TransactionItemDerivedAccounts>) -> Result<i64> {
    let transaction_item_account: &mut Account<TransactionItemState> = &mut ctx.accounts.transaction_item_account;
    Ok(transaction_item_account.get_updated_at())
}
