use anchor_lang::prelude::*;

use cellar::cpi::accounts::{SetData, VaultTrackerDerivedAccounts};
use cellar::instructions::VaultTrackerState;
use cellar::program::Cellar;
use cellar::{self, Data};

declare_id!("2qYuAL3WeNXFNwgEuofkNB73rWqDTodFZZmsnSfJmAc1");

#[program]
mod debank {
    use super::*;

    pub fn initialize_debank_program(ctx: Context<InitializeDebank>) -> Result<()> {
        msg!("DeBank initialized with ProgramID: {:?}", ctx.program_id);
        Ok(())
    }
    pub fn set_bank_name(ctx: Context<SetBankName>, data: String) -> Result<()> {
        cellar::cpi::set_data(ctx.accounts.set_data_ctx(), data)?;
        Ok(())
    }

    pub fn cpi_initialize_vault_tracker_account(
        ctx: Context<VaultTrackerDerivedAccountsCPIContext>,
        bump: u8,
        vault_initial_key: Pubkey,
        user_initial_key: Pubkey,
    ) -> Result<Pubkey> {
        let bump: &[u8] = &[bump][..];
        cellar::cpi::initialize_vault_tracker_account(
            ctx.accounts.vault_tracker_derived_account_ctx().with_signer(&[&[bump][..]]),
            vault_initial_key,
            user_initial_key,
        )?;
        Ok(ctx.accounts.vault_tracker_account.key())
    }

    pub fn vault_tracker_is_initialized(
        ctx: Context<VaultTrackerDerivedAccountsCPIContext>,
    ) -> Result<bool> {
        Ok(ctx.accounts.vault_tracker_account.is_initialized())
    }

}
#[derive(Accounts)]
pub struct InitializeDebank {}

#[derive(Accounts)]
pub struct SetBankName<'info> {
    #[account(mut)]
    pub cellar: Account<'info, Data>,
    pub cellar_program: Program<'info, Cellar>,
    #[account(mut, signer)]
    pub authority: Signer<'info>,
}

impl<'info> SetBankName<'info> {
    pub fn set_data_ctx(&self) -> CpiContext<'_, '_, '_, 'info, SetData<'info>> {
        let cpi_program: AccountInfo = self.cellar_program.to_account_info();
        let cpi_accounts: SetData = SetData {
            cellar: self.cellar.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}

#[derive(Accounts)]
pub struct VaultTrackerDerivedAccountsCPIContext<'info> {
    #[account(mut)]
    pub vault_tracker_account: Account<'info, VaultTrackerState>,
    pub cellar_program: Program<'info, Cellar>,
    /// CHECK: only used as a signing PDA
    #[account(mut, signer)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> VaultTrackerDerivedAccountsCPIContext<'info> {
    pub fn vault_tracker_derived_account_ctx(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, VaultTrackerDerivedAccounts<'info>> {
        let cpi_program: AccountInfo = self.cellar_program.to_account_info();
        let cpi_accounts: VaultTrackerDerivedAccounts = VaultTrackerDerivedAccounts {
            vault_tracker_account: self.vault_tracker_account.to_account_info(),
            authority: self.authority.to_account_info(),
            system_program: self.system_program.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
