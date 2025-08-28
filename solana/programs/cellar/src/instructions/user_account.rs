use anchor_lang::{
    prelude::*,
    solana_program::{
        entrypoint::ProgramResult,
        sysvar::rent::Rent
    }
};

use std::clone::Clone;

use cryptoxide::{
    ed25519,
    x25519,
};

use hex::{
    encode,
    ToHex
};

use password_encryptor::{
    EncryptionData, 
    PasswordEncryptor
};

use sha2::{
    Digest, 
    Sha256
};

use commons::throw_err;
use commons::ErrorType;
use commons::SysError;

use crate::VaultState;
use crate::VaultTrackerState;

#[event]
pub struct UserEvent {
    pub label: String,
    pub name: String,
    pub user_account: Pubkey,
    pub vault_account: Pubkey,
    pub authority: Pubkey,
}

#[account]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct UserState {
    pub user_index: u64,        // 8 bytes (fixed size)
    pub name: String,           // 16 * 4 = 64 ~ variable size (assuming 4 bytes per character)
    balance: u64,               // 8 bytes (fixed size)
    pub transaction_count: u64, // 8 bytes (fixed size)
    pub token_count: u64,       // 8 bytes (fixed size)
    vault_account_public_key: [u8; 32], // 32 bytes (fixed size)
    user_secret_key: [u8; 32],  // 32 bytes (fixed size)
    user_private_key: [u8; 32], // 32 bytes (fixed size)
    user_public_key: [u8; 32],  // 32 bytes (fixed size)
    user_shared_key: [u8; 32],  // 32 bytes (fixed size) (duplicate field)
    user_hashed_pwd: String,    // variable size (assuming 4 bytes per character)
    user_passd_salt: String,    // variable size (assuming 4 bytes per character)
    user_oauth_data: String,    // variable size (assuming 4 bytes per character)
    pub user_last_key: Pubkey,  // 32 bytes (fixed size)
    pub user_account: Pubkey,   // 32 bytes (fixed size)
    pub vault_account: Pubkey,  // 32 bytes (fixed size)
    pub authority: Pubkey,      // 32 bytes (fixed size)
    pub created_at: i64,        // 8 bytes (fixed size)
    pub updated_at: i64,        // 8 bytes (fixed size)
}

#[derive(Accounts)]
pub struct UserDerivedAccounts<'info> {

    #[account(init, payer = authority, space = 8 + 8 + 64 + 8 + 8 + 8 + 32 + 32 + 32 + 32 + 32 + 256 + 256 + 256 + 32 + 32 + 32 + 32 + 8 + 8)]
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
pub struct CloseUser<'info> {
    #[account(mut, close = authority)]
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

impl UserState {
    pub fn setup(
        &mut self,
        password: &str,
        salt: &str,
        vault_account_public_key: &x25519::PublicKey,
    ) {

        self.set_password_salt(salt);

        self.generate_secret_key();

        self.encrypt_password(password, salt);

        let mut hasher = Sha256::new();

        hasher.update(self.user_hashed_pwd.as_bytes());

        let hash = hasher.finalize();

        let hash_string: String = encode(hash);

        self.user_oauth_data = hash_string;

        let user_private: x25519::SecretKey = x25519::SecretKey::from(self.user_secret_key);

        let user_private_key: &[u8] = user_private.as_ref();

        let _private_key_string: String = user_private_key.encode_hex::<String>();

        let private_key_32: [u8; 32] = <[u8; 32]>::try_from(user_private_key).unwrap();

        self.user_private_key = private_key_32;

        let user_public: x25519::PublicKey = x25519::base(&user_private);

        let user_public_key: &[u8] = user_public.as_ref();

        let _public_key_string: String = user_public_key.encode_hex::<String>();

        let public_key_32: [u8; 32] = <[u8; 32]>::try_from(user_public_key).unwrap();

        self.user_public_key = public_key_32;

        let shared_secret: x25519::SharedSecret = x25519::dh(&user_private, vault_account_public_key);

        let user_shared_key: &[u8] = shared_secret.as_ref();

        let _shared_key_string: String = shared_secret.encode_hex::<String>();

        let shared_key_32: [u8; 32] = <[u8; 32]>::try_from(user_shared_key).unwrap();

        self.user_shared_key = shared_key_32;

        let vault_public_key: &[u8] = vault_account_public_key.as_ref();

        let _vault_public_key_string: String = vault_public_key.encode_hex::<String>();

        let vault_public_key_32: [u8; 32] = <[u8; 32]>::try_from(vault_public_key).unwrap();

        self.vault_account_public_key = vault_public_key_32;
        
    }

    pub fn init(
        &mut self,
        authority_key: Pubkey,
        vault_account_key: Pubkey,
        user_account_key: Pubkey,
        user_last_key: Pubkey,
        user_current_index: u64,
        name: String,
    ){

        self.set_authority(authority_key);
        self.set_vault_account(vault_account_key);
        self.set_user_account(user_account_key);
        self.set_user_index(user_current_index);
        self.set_name(name);
        self.set_user_last_key(user_last_key);
        self.set_balance(0);
        self.set_timestamps();

    }

    pub fn set_password_salt(&mut self, salt: &str) {
        self.user_passd_salt = salt.to_string();
    }

    pub fn sign_message(&mut self, message: &str) -> [u8; 64] {
        let (keypair, _) = ed25519::keypair(&self.get_user_secret_key());
        let signature: [u8; 64] = ed25519::signature(message.as_bytes(), &keypair);
        signature
    }

    pub fn verify_message(&mut self, message: &str, signature: [u8; 64]) -> bool {
        let verified: bool = ed25519::verify(message.as_bytes(), &self.get_user_public_key(), &signature);
        verified
    }

    pub fn generate_secret_key(&mut self) -> [u8; 32] {
        let mut skey = [0; 32];
        let rng:[u8; 32] = std::array::from_fn(|_| {
            std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos() as u8
        });
        skey.copy_from_slice(&rng); 
        self.user_secret_key = skey;
        skey
    }

    pub fn encrypt_password(&mut self, password: &str, salt: &str) -> String {
        let encryptor = PasswordEncryptor::new("secret_key".to_string().into_bytes(), None);
        let data = EncryptionData {
            content: &password,
            salt: &salt,
        };
        let encrypted_password = encryptor.encrypt_password(&data);
        match encrypted_password {
            Ok(result) => result,
            Err(e) => {
                format!("Unable to encrypt password. {:?}", e)
            }
        }
    }

    pub fn validate_password(
        &mut self,
        password: &str,
        encrypted_password: String,
        salt: &str,
    ) -> bool {
        let encryptor = PasswordEncryptor::new("secret_key".to_string().into_bytes(), None);
        let data = EncryptionData {
            content: &password,
            salt: &salt,
        };
        let is_valid_password = encryptor.validate_password(&data, &encrypted_password);
        is_valid_password.is_ok()
    }

    pub fn set_user_index(&mut self, user_index: u64) {
        self.user_index = user_index;
    }

    pub fn get_user_index(&self) -> u64 {
        self.user_index
    }

    pub fn set_name(&mut self, name: String) {
        self.name = name;
    }

    pub fn get_name(&self) -> String {
        self.name.clone()
    }

    pub fn set_balance(&mut self, balance: u64) {
        self.balance = balance;
    }

    pub fn get_balance(&self) -> u64 {
        self.balance
    }

    pub fn increament_transaction_count(&mut self) {
        self.transaction_count = self.transaction_count + 1;
    }

    pub fn decreament_transaction_count(&mut self) {
        if self.transaction_count > 0 {
            self.transaction_count = self.transaction_count - 1;
        }
    }

    pub fn set_transaction_count(&mut self, transaction_count: u64) {
        self.transaction_count = transaction_count;
    }

    pub fn get_transaction_count(&self) -> u64 {
        self.transaction_count
    }

    pub fn increament_token_count(&mut self) {
        self.token_count = self.token_count + 1;
    }

    pub fn decreament_token_count(&mut self) {
        if self.token_count > 0{
            self.token_count = self.token_count - 1;
        }
    }

    pub fn set_token_count(&mut self, token_count: u64) {
        self.token_count = token_count;
    }

    pub fn get_token_count(&self) -> u64 {
        self.token_count
    }

    pub fn set_user_secret_key(&mut self, user_secret_key: [u8; 32]) {
        self.user_secret_key = user_secret_key;
    }

    pub fn get_user_secret_key(&self) -> [u8; 32] {
        self.user_secret_key
    }

    pub fn set_user_public_key(&mut self, user_public_key: [u8; 32]) {
        self.user_public_key = user_public_key;
    }

    pub fn get_user_public_key(&self) -> [u8; 32] {
        self.user_public_key
    }

    pub fn set_user_shared_key(&mut self, user_shared_key: [u8; 32]) {
        self.user_shared_key = user_shared_key;
    }

    pub fn get_user_shared_key(&self) -> [u8; 32] {
        self.user_shared_key
    }

    pub fn set_user_hashed_pwd(&mut self, user_hashed_pwd: String) {
        self.user_hashed_pwd = user_hashed_pwd;
    }

    pub fn get_user_hashed_pwd(&self) -> String {
        self.user_hashed_pwd.clone()
    }

    pub fn set_user_oauth_data(&mut self, user_oauth_data: String) {
        self.user_oauth_data = user_oauth_data;
    }

    pub fn get_user_oauth_data(&self) -> String {
        self.user_oauth_data.clone()
    }

    pub fn set_user_last_key(&mut self, user_last_key: Pubkey) {
        self.user_last_key = user_last_key;
    }

    pub fn get_user_last_key(&self) -> Pubkey {
        self.user_last_key
    }

    pub fn set_user_account(&mut self, user_account: Pubkey) {
        self.user_account = user_account;
    }

    pub fn get_user_account(&self) -> Pubkey {
        self.user_account
    }

    pub fn set_vault_account(&mut self, vault_account: Pubkey) {
        self.vault_account = vault_account;
    }

    pub fn get_vault_account(&self) -> Pubkey {
        self.vault_account
    }

    pub fn set_authority(&mut self, authority: Pubkey) {
        self.authority = authority;
    }

    pub fn get_authority(&self) -> Pubkey {
        self.authority
    }

    pub fn set_created_at(&mut self, created_at: i64) {
        self.created_at = created_at;
    }

    pub fn get_created_at(&self) -> i64 {
        self.created_at
    }

    pub fn set_updated_at(&mut self, updated_at: i64) {
        self.updated_at = updated_at;
    }

    pub fn get_updated_at(&self) -> i64 {
        self.updated_at
    }

    pub fn set_timestamps(&mut self) {
        self.created_at = Clock::get().unwrap().unix_timestamp;
        self.updated_at = Clock::get().unwrap().unix_timestamp;
    }
}

pub fn initialize_user_account<'a>(
    ctx: Context<UserDerivedAccounts>,
    name: String,
    password: String,
    salt: String,
) -> Result<(String, Pubkey, Pubkey, Pubkey)> {
    let vault_tracker_account: &mut Account<VaultTrackerState> =
        &mut ctx.accounts.vault_tracker_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;

    let user_account_key: Pubkey = user_account.key();

    if vault_account.is_user_initialized() {
        throw_err(ErrorType::VaultError, SysError::UserAccountAlreadyExists);
    }

    if name.is_empty() {
        throw_err(ErrorType::VaultError, SysError::EmptyName);
    }

    if name.len() > 32 {
        throw_err(ErrorType::VaultError, SysError::LongName);
    }

    if password.to_string().is_empty() {
        throw_err(ErrorType::VaultError, SysError::ShortPassword);
    }

    if password.to_string().len() < 4 {
        throw_err(ErrorType::VaultError, SysError::ShortPassword);
    }

    if password.to_string().len() > 16 {
        throw_err(ErrorType::VaultError, SysError::LongPassword);
    }

    let secret: x25519::SecretKey = x25519::SecretKey::from(vault_account.key().to_bytes());
    let vault_account_public: x25519::PublicKey = x25519::base(&secret);

    user_account.init(
        authority.key().clone(),
        vault_account.key().clone(),
        user_account_key.clone(),
        vault_tracker_account.get_user_last_key(),
        vault_tracker_account.get_user_current_index(),
        name.clone(),
    );

    user_account.setup(password.as_str(), salt.as_str(), &vault_account_public);

    vault_account.set_is_user_initialized(true);
    vault_tracker_account.set_user_last_key(user_account.key().clone());
    vault_tracker_account.increament_user_current_index();

    emit!(UserEvent {
        label: "USR.CREATE".to_string(),
        name: name.clone(),
        authority: authority.key().clone(),
        vault_account: vault_account.key().clone(),
        user_account: user_account.key().clone(),
    });

    Ok((
        name,
        authority.key(),
        vault_account.key(),
        user_account.key(),
    ))
}

pub fn close_user(ctx: Context<CloseUser>) -> ProgramResult {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    let vault_account: &mut Account<VaultState> = &mut ctx.accounts.vault_account;
    let authority: &mut Signer = &mut ctx.accounts.authority;
    let system_program: &mut Program<System> = &mut ctx.accounts.system_program;

    let rent = Rent::get().unwrap();
    let rent_lamports = rent.minimum_balance(user_account.to_account_info().data_len());

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

    // Check if the authority is the same as the user authority
    if *authority.key != user_account.authority {
        throw_err(
            ErrorType::VaultError,
            SysError::InvalidAuthority(
                authority.key().to_string(),
                user_account.authority.to_string(),
            ),
        );
    }

    // Check if the user has any users or transactions
    if user_account.transaction_count > 0 {
        throw_err(
            ErrorType::VaultError,
            SysError::UserAccountHasExistingTransactions(
                user_account.key().to_string(),
                user_account.transaction_count,
            ),
        );
    }

    // Check if the user account has sufficient funds
    if user_account.to_account_info().lamports() < rent_lamports {
        throw_err(
            ErrorType::VaultError,
            SysError::InsufficientFundsRental(
                user_account.key().to_string(),
                rent_lamports,
                user_account.to_account_info().lamports(),
            ),
        );
    }

    vault_account.set_is_user_initialized(false);

    // Try to close the user account and transfer the lamports to the authority
    match user_account.close(authority.to_account_info()) {
        Ok(()) => Ok(()),
        Err(e) => Err(e.into()),
    }
}

pub fn user_sign_message(ctx: Context<UserDerivedAccounts>, message: &str) -> Result<[u8; 64]> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.sign_message(message))
}

pub fn user_verify_message(ctx: Context<UserDerivedAccounts>, message: &str, signature: [u8; 64]) -> Result<bool> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.verify_message(message, signature))
}

pub fn user_generate_secret_key(ctx: Context<UserDerivedAccounts>) -> Result<[u8; 32]> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.generate_secret_key())
}

pub fn user_encrypt_password(ctx: Context<UserDerivedAccounts>, password: &str, salt: &str) -> Result<String> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.encrypt_password(password, salt))
}

pub fn user_validate_password(ctx: Context<UserDerivedAccounts>, password: &str, encrypted_password: String, salt: &str) -> Result<bool> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.validate_password(password, encrypted_password, salt))
}

pub fn user_get_user_index(ctx: Context<UserDerivedAccounts>) -> Result<u64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_index())
}

pub fn user_get_name(ctx: Context<UserDerivedAccounts>) -> Result<String> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_name())
}

pub fn user_get_balance(ctx: Context<UserDerivedAccounts>) -> Result<u64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_balance())
}

pub fn user_get_transaction_count(ctx: Context<UserDerivedAccounts>) -> Result<u64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_transaction_count())
}

pub fn user_get_token_count(ctx: Context<UserDerivedAccounts>) -> Result<u64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_token_count())
}

pub fn user_get_user_secret_key(ctx: Context<UserDerivedAccounts>) -> Result<[u8; 32]> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_secret_key())
}

pub fn user_get_user_public_key(ctx: Context<UserDerivedAccounts>) -> Result<[u8; 32]> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_public_key())
}

pub fn user_get_user_hashed_pwd(ctx: Context<UserDerivedAccounts>) -> Result<String> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_hashed_pwd())
}

pub fn user_get_user_oauth_data(ctx: Context<UserDerivedAccounts>) -> Result<String> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_oauth_data())
}

pub fn user_get_user_last_key(ctx: Context<UserDerivedAccounts>) -> Result<Pubkey> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_last_key())
}

pub fn user_get_user_account(ctx: Context<UserDerivedAccounts>) -> Result<Pubkey> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_account())
}

pub fn user_get_vault_account(ctx: Context<UserDerivedAccounts>) -> Result<Pubkey> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_vault_account())
}

pub fn user_get_authority(ctx: Context<UserDerivedAccounts>) -> Result<Pubkey> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_authority())
}

pub fn user_get_created_at(ctx: Context<UserDerivedAccounts>) -> Result<i64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_created_at())
}

pub fn user_get_updated_at(ctx: Context<UserDerivedAccounts>) -> Result<i64> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_updated_at())
}

pub fn user_get_user_shared_key(ctx: Context<UserDerivedAccounts>) -> Result<[u8; 32]> {
    let user_account: &mut Account<UserState> = &mut ctx.accounts.user_account;
    Ok(user_account.get_user_shared_key())
}
