use std::collections::HashMap;
use candid::CandidType;
use crate::assets::timestamp;
use serde::Deserialize;

pub type BatchId = u128;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Batch {
    batch_id: BatchId,
    expires_at: u64
}

impl Batch {
    pub fn new(batch_id: BatchId) -> Batch {
        Batch {
            batch_id,
            expires_at: Batch::get_next_expire_time()
        }
    }

    pub fn get_batch_id(&self) -> BatchId {
        self.batch_id
    }

    pub fn refresh_expiry(&mut self) {
        self.expires_at = Batch::get_next_expire_time();
    }

    pub fn is_expired(&self, as_of: u64) -> bool {
        self.expires_at < as_of
    }

    fn get_next_expire_time() -> u64 {
        let five_mins_nanos = 5 * 60 * 1000 * 1000 * 1000;
        timestamp::now() + five_mins_nanos
    }
}

#[derive(Default, Clone, Debug, CandidType, Deserialize)]
pub struct Batches {
    next_batch_id: BatchId,
    batches: HashMap<BatchId, Batch>,
}

impl Batches {
    pub fn get(&self, batch_id: BatchId) -> Option<&Batch> {
        self.batches.get(&batch_id)
    }

    pub fn get_mut(&mut self, batch_id: BatchId) -> Option<&mut Batch> {
        self.batches.get_mut(&batch_id)
    }

    pub fn get_ids(&mut self) -> Vec<BatchId> {
        self.batches.keys().cloned().collect()
    }

    pub fn delete(&mut self, batch_id: BatchId) {
        self.batches.remove(&batch_id);
    }

    pub fn create(&mut self) -> &Batch {
        let batch_id = self.next_batch_id;
        let batch = Batch::new(batch_id);

        self.next_batch_id = self.next_batch_id + 1;
        self.batches.insert(batch_id, batch);
        self.batches.get(&batch_id).unwrap()
    }

    pub fn delete_expired(&mut self) {
        let now = timestamp::now();
        self.batches.retain(|_, batch| !batch.is_expired(now));
    }

    pub fn clear(&mut self) {
        self.next_batch_id = 1;
        self.batches = HashMap::new()
    }
}
