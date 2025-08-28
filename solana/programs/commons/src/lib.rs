use anchor_lang::prelude::*;

use uuid::Uuid;
use crate::libs::cryptolib::hash_256;
use sha2::{Sha256, Digest};
declare_id!("J2q2ki2AuY3E3T5t7nyLB4vopSk7oUTUk6RuAZVYZeGc");

#[program]
pub mod commons { }

use std::fmt;

pub enum SysError {
    VaultTrackerAccountAlreadyExists(String),
    VaultAccountAlreadyExists(String),
    VaultAccountHasExistingUsers(String, u64),
    VaultAccountHasExistingTransactions(String, u64),
    VaultAccountHasExistingTokens(String, u64),
    UserAccountAlreadyExists,
    UserAccountHasExistingTransactions(String, u64),
    TransactionAccountAlreadyExists,
    TransactionAccountHasExistingTransactionItems(String, u64),
    TransactionItemAccountPayloadMissing,
    EmptyPassword,
    ShortPassword,
    LongPassword,
    EmptyName,
    LongName,
    EmptyDescription,
    LongDescription,
    InvalidNumberOfAccounts,
    InvalidInput(String),
    InvalidAmount(u64),
    InvalidPublicKey(String),
    InvalidProgramID(String, String),
    InvalidAuthority(String, String),
    InsufficientFunds(String, u64),
    InsufficientFundsRental(String, u64, u64),
    TokenAccountTokens(String, u64),
    TransactionItemDepositError(String),
    TransactionItemSendError(String),
    TransactionItemTransferError(String),
    TransactionItemClaimError(String),
    TransactionItemWithdrawalError(String),
    TransactionItemStatementError(String),
}

impl fmt::Display for SysError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            SysError::VaultTrackerAccountAlreadyExists(ref public_key) => write!(f, "The vault tracker account for this signer wallet has already been initialized with the public key: {}", public_key),
            SysError::VaultAccountAlreadyExists(ref public_key) => write!(f, "The vault account for this vault tracker has already been initialized with the public key: {}", public_key),
            SysError::VaultAccountHasExistingUsers(ref account, count) => write!(f, "Vault Account '{}' has {} existing users.", account, count),
            SysError::VaultAccountHasExistingTransactions(ref account, count) => write!(f, "Vault Account '{}' has {} existing transactions.", account, count),
            SysError::VaultAccountHasExistingTokens(ref account, count) => write!(f, "Vault Account '{}' has {} existing token accounts.", account, count),
            SysError::UserAccountAlreadyExists => write!(f, "The user account for this vault has already been initialized"),
            SysError::UserAccountHasExistingTransactions(ref account, count) => write!(f, "User Account '{}' has {} existing transactions.", account, count),
            SysError::TransactionAccountAlreadyExists => write!(f, "The transaction account for this vault has already been initialized"),
            SysError::TransactionAccountHasExistingTransactionItems(ref account, count) => write!(f, "Transaction Account '{}' has {} existing transaction items.", account, count),
            SysError::TransactionItemAccountPayloadMissing => write!(f, "Transaction payload is missing"),
            SysError::EmptyPassword => write!(f, "Password cannot be an empty string"),
            SysError::ShortPassword => write!(f, "Password cannot be less than 4 characters"),
            SysError::LongPassword => write!(f, "Password cannot exceed 16 characters"),
            SysError::EmptyName => write!(f, "Name cannot be an empty string"),
            SysError::LongName => write!(f, "Name cannot exceed 16 characters"),
            SysError::EmptyDescription => write!(f, "Description cannot be an empty string"),
            SysError::LongDescription => write!(f, "Description cannot exceed 64 characters"),
            SysError::InvalidNumberOfAccounts => write!(f, "Invalid number of accounts"),
            SysError::InvalidInput(ref amount) => write!(f, "Invalid input: {}", amount),
            SysError::InvalidAmount(ref u8) => write!(f, "Invalid amount: {}", u8),
            SysError::InvalidPublicKey(ref public_key) => write!(f, "Invalid public key: {}", public_key),
            SysError::InvalidProgramID(ref account, program_id) => write!(f, "Invalid Program ID: {}, required id: {}", program_id, account),
            SysError::InvalidAuthority(ref account, authority) => write!(f, "Invalid Authority: {}, required authority: {}", authority, account),
            SysError::InsufficientFunds(ref account, balance) => write!(f, "Account '{}' has insufficient funds. Lamport balance: {}", account, balance),
            SysError::InsufficientFundsRental(ref account, required, available) => write!(f, "Account '{}' has insufficient funds to pay for the rental. Required rental lamports: {}. Available lamports: {}", account, required, available),
            SysError::TokenAccountTokens(ref account, count) => write!(f, "Token Account '{}' has {} existing tokens.", account, count),
            SysError::TransactionItemDepositError(ref error) => write!(f, "Confidential Token deposit error: {}.", error),
            SysError::TransactionItemSendError(ref error) => write!(f, "Confidential Token send error: {}.", error),
            SysError::TransactionItemTransferError(ref error) => write!(f, "Confidential Token transfer error: {}.", error),
            SysError::TransactionItemClaimError(ref error) => write!(f, "Confidential Token claim error: {}.", error),
            SysError::TransactionItemWithdrawalError(ref error) => write!(f, "Confidential Token withdrawal error: {}.", error),
            SysError::TransactionItemStatementError(ref error) => write!(f, "Confidential Token statement error: {}.", error),
        }
    }
}

pub enum ErrorType {
    VaultError,
    UserError,
    TransactionError,
    TransactionItemError,
    DepositError,
    TransferError,
    SendError,
    ClaimError,
    WithdrawalError,
    StatementError,
    GenericError,
    UnspecifiedError,
}

impl ErrorType {
    const VAULT_ERROR: &'static str = "VaultError";
    const USER_ERROR: &'static str = "UserError";
    const TRANSACTION_ERROR: &'static str = "TransactionError";
    const TRANSACTION_ITEM_ERROR: &'static str = "TransactionItemError";
    const DEPOSIT_ERROR: &'static str = "DepositError";
    const TRANSFER_ERROR: &'static str = "TransferError";
    const SEND_ERROR: &'static str = "SendError";
    const CLAIM_ERROR: &'static str = "ClaimError";
    const WITHDRAWAL_ERROR: &'static str = "WithdrawalError";
    const STATEMENT_ERROR: &'static str = "StatementError";
    const GENERIC_ERROR: &'static str = "GenericError";
    const UNSPECIFIED_ERROR: &'static str = "UnspecifiedError";
}

pub fn throw_err(err_type: ErrorType, err_message: SysError) {
    match err_type {
        ErrorType::VaultError => panic!("{}: {}", ErrorType::VAULT_ERROR, err_message),
        ErrorType::UserError => panic!("{}: {}", ErrorType::USER_ERROR, err_message),
        ErrorType::TransactionError => {
            panic!("{}: {}", ErrorType::TRANSACTION_ERROR, err_message)
        }
        ErrorType::TransactionItemError => {
            panic!("{}: {}", ErrorType::TRANSACTION_ITEM_ERROR, err_message)
        }
        ErrorType::DepositError => panic!("{}: {}", ErrorType::DEPOSIT_ERROR, err_message),
        ErrorType::TransferError => panic!("{}: {}", ErrorType::TRANSFER_ERROR, err_message),
        ErrorType::SendError => panic!("{}: {}", ErrorType::SEND_ERROR, err_message),
        ErrorType::ClaimError => panic!("{}: {}", ErrorType::CLAIM_ERROR, err_message),
        ErrorType::WithdrawalError => panic!("{}: {}", ErrorType::WITHDRAWAL_ERROR, err_message),
        ErrorType::StatementError => panic!("{}: {}", ErrorType::STATEMENT_ERROR, err_message),
        ErrorType::GenericError => panic!("{}: {}", ErrorType::GENERIC_ERROR, err_message),
        _ => panic!("{}: {}", ErrorType::UNSPECIFIED_ERROR, err_message),
    }
}

pub const UPPERCASE: &str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
pub const LOWERCASE: &str = "abcdefghijklmnopqrstuvwxyz";
pub const NUMBERS: &str   = "0123456789";
pub const SYMBOLS: &str   = ")(*&^%$#@!~*/+?.";

// Simple deterministic shuffling function using a seed
fn shuffle_string(input: &str, seed: usize) -> String {
    let mut chars: Vec<char> = input.chars().collect();
    let len = chars.len();
    
    // Simple deterministic "shuffling" algorithm
    for i in 0..len {
        let swap_index = (i * seed + 7) % len;
        chars.swap(i, swap_index);
    }
    
    chars.into_iter().collect()
}

pub fn gen_usr(username_length: usize) -> String {
    let mut username = String::new();
    let all_chars = format!("{}{}{}", UPPERCASE, LOWERCASE, NUMBERS);
    let shuffled = shuffle_string(&all_chars, username_length);
    
    for i in 0..username_length {
        let index = (i * 13 + 5) % shuffled.len();
        username.push(shuffled.chars().nth(index).unwrap());
    }
    username
}

pub fn gen_pwd(password_length: usize) -> String {
    let mut password = String::new();
    let all_chars = format!("{}{}{}{}", UPPERCASE, LOWERCASE, NUMBERS, SYMBOLS);
    let shuffled = shuffle_string(&all_chars, password_length);
    
    for i in 0..password_length {
        let index = (i * 17 + 3) % shuffled.len();
        password.push(shuffled.chars().nth(index).unwrap());
    }
    password
}

#[no_mangle]
pub fn gen_key() -> String {
    // Use a timestamp-based approach for variation
    format!("key_{}_{}", gen_pwd(16), gen_uuid())
}

#[no_mangle]
pub fn gen_uuid() -> String {
    // Simple deterministic UUID-like string
    // This is not a real UUID, but generates a similar format
    let timestamp = (Clock::get().unwrap().unix_timestamp as u64).to_string();
    let pwd_part = gen_pwd(8);
    
    format!("{}-{}-{}-{}-{}",
        &pwd_part[0..8],
        &pwd_part[8..12], 
        &pwd_part[12..16],
        &pwd_part[16..20],
        &timestamp[timestamp.len().saturating_sub(12)..]
    )
}
