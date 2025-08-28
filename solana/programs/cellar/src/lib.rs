use anchor_lang::prelude::*;

use instructions::*;
pub mod instructions;

declare_id!("EkL33tCjPsjnxZAcVaHPxpEkAX3WdVtuVsvzVf1iLHTj");


#[program]
pub mod cellar {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, authority: Pubkey) -> Result<()> {
        ctx.accounts.cellar.authority = authority;
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn init_rent_vault(ctx: Context<InitRentVault>, fund_lamports: u64) -> Result<()> {
        init_rent_vault::init_rent_vault(ctx, fund_lamports)
    }

    pub fn create_new_account(ctx: Context<CreateNewAccount>) -> Result<()> {
        create_new_account::create_new_account(ctx)
    }

    pub fn initialize_vault_tracker_account(
        ctx: Context<VaultTrackerDerivedAccounts>, 
        vault_initial_key: Pubkey,
        user_initial_key: Pubkey,
    ) -> Result<Pubkey> {
        let result_pubkey:Pubkey = vault_tracker_account::initialize_vault_tracker_account(ctx, vault_initial_key, user_initial_key)?;
        Ok(result_pubkey) //ctx.accounts.vault_tracker_account.key()
    }

    pub fn vault_tracker_is_initialized(ctx: Context<VaultTrackerDerivedAccounts>) -> Result<bool> {
        let vault_tracker_account: &mut Account<VaultTrackerState> = &mut ctx.accounts.vault_tracker_account;
        Ok(vault_tracker_account.is_initialized())
    }

    pub fn set_data(ctx: Context<SetData>, data: String) -> Result<()> {
        let cellar: &mut Account<Data> = &mut ctx.accounts.cellar;
        cellar.data = data;
        Ok(())
    }

}


#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 256 + 32)]
    pub cellar: Account<'info, Data>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct SetData<'info> {
    #[account(mut, has_one = authority)]
    pub cellar: Account<'info, Data>,
    pub authority: Signer<'info>
}


#[account]
pub struct Data {
    pub data: String,
    pub authority: Pubkey
}
