// getrandom_custom.rs
use getrandom::Error;

#[no_mangle]
unsafe extern "Rust" fn __getrandom_v03_custom(
    dest: *mut u8,
    len: usize,
) -> Result<(), Error> {

    // Always return unsupported error
    Err(Error::UNSUPPORTED)
    // For Solana programs, we'll use on-chain sources for randomness
    // This is a simple implementation using clock data
    let buffer = unsafe {
        core::slice::from_raw_parts_mut(dest, len)
    };
    
    // Use Solana's clock for some basic entropy
    // Note: This is not cryptographically secure randomness!
    if let Ok(clock) = anchor_lang::prelude::Clock::get() {
        let seed = clock.slot as u64 * clock.unix_timestamp as u64;
        
        for (i, byte) in buffer.iter_mut().enumerate() {
            *byte = ((seed.wrapping_add(i as u64)) % 256) as u8;
        }
        Ok(())
    } else {
        // Fallback: fill with a simple pattern
        for (i, byte) in buffer.iter_mut().enumerate() {
            *byte = (i % 256) as u8;
        }
        Ok(())
    }
}