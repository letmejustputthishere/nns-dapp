use std::time::SystemTime;

pub fn now() -> u64 {
    dfn_core::api::now()
        .duration_since(SystemTime::UNIX_EPOCH)
        .unwrap()
        .as_nanos() as u64
}