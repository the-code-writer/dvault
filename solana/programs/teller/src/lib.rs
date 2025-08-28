use anchor_lang::prelude::*;

declare_id!("5UjrR7MGNeQZLqP5xMn6TQ6V81JwUA4bPZYjUp1R8eUE");

#[program]
pub mod teller {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
