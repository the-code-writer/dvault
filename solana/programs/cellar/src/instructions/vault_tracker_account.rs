use anchor_lang::prelude::*;

use commons::ErrorType;
use commons::SysError;
use commons::throw_err;

#[derive(Accounts)]
pub struct VaultTrackerDerivedAccounts<'info> {
    #[account(init, payer = authority, space = 8 + 8 + 32 + 32 + 8 + 32 + 8 + 1 + 32)]
    pub vault_tracker_account: Account<'info, VaultTrackerState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(constraint = system_program.key() == anchor_lang::solana_program::system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[event]
pub struct VaultTrackerEvent {
    pub label: String,
    pub vault_initial_key: Pubkey,
    pub user_initial_key: Pubkey,
    pub vault_tracker_account: Pubkey,
    pub ctx_accounts: String,
    pub pda_accounts: String,

}

#[account]
pub struct VaultTrackerState {
    pub vault_current_index: u64,
    pub vault_tracker_account_key: Pubkey,
    pub vault_last_key: Pubkey,
    pub user_current_index: u64,
    pub user_last_key: Pubkey,
    pub transaction_current_index: u64,
    pub initialized: bool,
    pub authority: Pubkey,
}

impl VaultTrackerState {
    pub fn new(
        vault_current_index: u64,
        vault_tracker_account_key: Pubkey,
        vault_last_key: Pubkey,
        user_current_index: u64,
        user_last_key: Pubkey,
        transaction_current_index: u64,
        initialized: bool,
        authority: Pubkey,
    ) -> Self {
        VaultTrackerState {
            vault_current_index,
            vault_tracker_account_key,
            vault_last_key,
            user_current_index,
            user_last_key,
            transaction_current_index,
            initialized,
            authority
        }
    }

    pub fn init(&mut self, vault_tracker_account_key: Pubkey, vault_initial_key: Pubkey, user_initial_key: Pubkey) {
        if self.initialized {
            return;
        }
        self.set_vault_current_index(0);
        self.set_vault_tracker_account_key(vault_tracker_account_key);
        self.set_vault_last_key(vault_initial_key);
        self.set_user_last_key(user_initial_key);
        self.set_user_current_index(0);
        self.set_transaction_current_index(0);
        self.set_is_initialized(true);
    }

    pub fn is_initialized(&self) -> bool {
        self.initialized
    }

    pub fn set_is_initialized(&mut self, value: bool) {
        self.initialized = value;
    }

    pub fn get_vault_current_index(&self) -> u64 {
        self.vault_current_index
    }

    pub fn get_vault_tracker_account_key(&self) -> Pubkey {
        self.vault_tracker_account_key
    }

    pub fn set_vault_tracker_account_key(&mut self, vault_tracker_account_key: Pubkey) {
        self.vault_tracker_account_key = vault_tracker_account_key;
    }

    pub fn set_vault_current_index(&mut self, vault_current_index: u64) {
        self.vault_current_index = vault_current_index;
    }

    pub fn increament_vault_current_index(&mut self) {
        self.vault_current_index = self.vault_current_index + 1;
    }

    pub fn get_vault_last_key(&mut self) -> Pubkey {
        self.vault_last_key
    }

    pub fn set_vault_last_key(&mut self, vault_last_key: Pubkey) {
        self.vault_last_key = vault_last_key;
    }

    pub fn get_user_current_index(&self) -> u64 {
        self.user_current_index
    }

    pub fn set_user_current_index(&mut self, user_current_index: u64) {
        self.user_current_index = user_current_index;
    }

    pub fn increament_user_current_index(&mut self) {
        self.user_current_index = self.user_current_index + 1;
    }

    pub fn get_user_last_key(&self) -> Pubkey {
        self.user_last_key
    }

    pub fn set_user_last_key(&mut self, user_last_key: Pubkey) {
        self.user_last_key = user_last_key;
    }

    pub fn get_transaction_current_index(&self) -> u64 {
        self.transaction_current_index
    }

    pub fn set_transaction_current_index(&mut self, transaction_current_index: u64) {
        self.transaction_current_index = transaction_current_index;
    }

    pub fn increament_transaction_current_index(&mut self) {
        self.transaction_current_index = self.transaction_current_index + 1;
    }

}

pub fn initialize_vault_tracker_account(
    ctx: Context<VaultTrackerDerivedAccounts>,
    vault_initial_key: Pubkey,
    user_initial_key: Pubkey,
) -> Result<Pubkey> {
    
    let ctx_accounts = ctx.accounts.to_account_infos();

    let accounts = ctx.accounts.to_account_infos();

    let pda_accounts_list = accounts
        .into_iter()
        .filter(|account| account.owner == ctx.program_id)
        .collect::<Vec<_>>();

    let vault_tracker_account: &mut Account<VaultTrackerState> =
        &mut ctx.accounts.vault_tracker_account;

    let vault_tracker_account_key: Pubkey = vault_tracker_account.key();
    
    if ctx_accounts.len() > 3 {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidNumberOfAccounts,
        );
    }

    if pda_accounts_list.len() > 1 {
        throw_err(
            ErrorType::VaultError,
            SysError::VaultTrackerAccountAlreadyExists(
                vault_tracker_account_key.to_string().clone(),
            ),
        );
    }

    vault_tracker_account.init(
        vault_tracker_account_key.clone(), 
        vault_initial_key, 
        user_initial_key
    );

    emit!(VaultTrackerEvent {
        label: "VLT.TRACKER.CREATE".to_string(),
        vault_initial_key: vault_initial_key.key().clone(),
        user_initial_key: user_initial_key.key().clone(),
        vault_tracker_account: vault_tracker_account_key.key().clone(),
        ctx_accounts: ctx_accounts.len().to_string(),
        pda_accounts: pda_accounts_list.len().to_string(),
    });

    Ok(vault_tracker_account_key)
}

pub fn vault_tracker_is_initialized(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<bool> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.is_initialized())
}

pub fn vault_tracker_get_vault_current_index(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<u64> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_vault_current_index())
}

pub fn vault_tracker_get_vault_tracker_account_key(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<Pubkey> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_vault_tracker_account_key())
}

pub fn vault_tracker_get_vault_last_key(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<Pubkey> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_vault_last_key())
}

pub fn vault_tracker_get_user_current_index(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<u64> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_user_current_index())
}

pub fn vault_tracker_get_user_last_key(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<Pubkey> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_user_last_key())
}

pub fn vault_tracker_get_transaction_current_index(
    ctx: Context<VaultTrackerDerivedAccounts>,
) -> Result<u64> {
    let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
    Ok(vault_tracker_account.get_transaction_current_index())
}
