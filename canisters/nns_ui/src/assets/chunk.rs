use std::collections::HashMap;
use candid::CandidType;
use serde::Deserialize;
use super::batch::{Batch, Batches, BatchId};
use crate::assets::timestamp;

pub type ChunkId = u128;

#[derive(Clone, Debug, CandidType, Deserialize)]
struct Chunk {
    batch_id: BatchId,
    content: Vec<u8>
}

#[derive(Default, Clone, Debug, CandidType, Deserialize)]
pub struct Chunks {
    batches: Batches,
    next_chunk_id: ChunkId,
    chunks: HashMap<ChunkId, Chunk>,
}

impl Chunks {
    pub fn create(&mut self, batch: &mut Batch, content: Vec<u8>) -> ChunkId {
        let chunk = Chunk {
            batch_id: batch.get_batch_id(),
            content
        };
        let chunk_id = self.next_chunk_id;
        batch.refresh_expiry();
        self.next_chunk_id = self.next_chunk_id + 1;
        self.chunks.insert(chunk_id, chunk);
        chunk_id
    }

    pub fn take(&mut self, chunk_id: ChunkId) -> Result<Vec<u8>, String> {
        match self.chunks.remove(&chunk_id) {
            Some(chunk) => Ok(chunk.content),
            None => Err("chunk not found".to_string())
        }
    }

    pub fn reset(&mut self) {
        self.next_chunk_id = 1;
        self.chunks = HashMap::new();
    }

    pub fn delete_expired(&mut self) {
        let now = timestamp::now();
        let batch_ids = self.batches.get_ids();
        let expired_batch_ids: Vec<_> = batch_ids
            .iter()
            .filter(|&b| self.batches.get(*b).unwrap().is_expired(now))
            .cloned()
            .collect();

        if !expired_batch_ids.is_empty() {
            self.chunks.retain(|_, chunk| !expired_batch_ids.contains(&chunk.batch_id));
        }
    }
}
