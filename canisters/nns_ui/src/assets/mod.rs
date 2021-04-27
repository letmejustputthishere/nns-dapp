use candid::CandidType;
use crate::assets::asset::{Asset, AssetDetails, AssetEncoding};
use crate::assets::batch::{Batches, BatchId};
use crate::assets::chunk::{ChunkId, Chunks};
use dfn_candid::{candid_one, Candid};
use dfn_core::api::PrincipalId;
use dfn_core::over;
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::HashMap;
use std::ops::Deref;
use on_wire::{IntoWire, FromWire};
use crate::assets::http_request::http_request_impl;
use std::borrow::Borrow;
use itertools::Itertools;

mod asset;
mod batch;
mod chunk;
mod timestamp;
mod http_request;

thread_local! {
    static AUTHORIZED: RefCell<Vec<PrincipalId>> = RefCell::new(Vec::new());
    static ASSETS: RefCell<HashMap<String, Asset>> = RefCell::new(HashMap::default());
    static BATCHES: RefCell<Batches> = RefCell::new(Batches::default());
    static CHUNKS: RefCell<Chunks> = RefCell::new(Chunks::default());
}

pub fn init() {
    // let controller = dfn_core::api::controller();
    // AUTHORIZED.with(|authorized| {
    //     if authorized.borrow().is_empty() {
    //         authorized.borrow_mut().push(controller);
    //     }
    // });
}

pub fn encode_to_bytes() -> Vec<u8> {
    AUTHORIZED.with(|authorized| {
        let authorized = authorized.borrow();
        ASSETS.with(|assets| {
            let assets = assets.borrow();
            BATCHES.with(|batches| {
                let batches = batches.borrow();
                CHUNKS.with(|chunks| {
                    chunks.borrow();

                    Candid((authorized.deref(), assets.deref(), batches.deref(), chunks.deref())).into_bytes().unwrap()
                })
            })
        })
    })
}

pub fn fill_from_bytes(bytes: Vec<u8>) -> Result<(), String> {
    let (authorized, assets, batches, chunks): (Vec<PrincipalId>, HashMap<String, Asset>, Batches, Chunks) =
        Candid::from_bytes(bytes).map(|c| c.0)?;

    AUTHORIZED.with(|a| a.replace(authorized));
    ASSETS.with(|a| a.replace(assets));
    BATCHES.with(|b| b.replace(batches));
    CHUNKS.with(|c| c.replace(chunks));

    Ok(())
}

#[export_name = "canister_update authorize"]
pub fn authorize() {
    over(candid_one, authorize_impl);
}

fn authorize_impl(principal: PrincipalId) {
    if !is_safe(principal) {
        panic!("not authorized");
    }

    AUTHORIZED.with(|authorized| {
        if !authorized.borrow().contains(&principal) {
            authorized.borrow_mut().push(principal);
        }
    });
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ListRequest {}

#[export_name = "canister_query list"]
pub fn list() {
    over(candid_one, |_: ListRequest| list_impl());
}

fn list_impl() -> Vec<AssetDetails> {
    ASSETS.with(|assets| assets
        .borrow()
        .iter()
        .map(|(key, asset)| Asset::to_asset_details(key.clone(), asset))
        .collect())
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateBatchRequest {}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateBatchResponse {
    batch_id: BatchId
}

#[export_name = "canister_update create_batch"]
pub fn create_batch() {
    over(candid_one, |_: CreateBatchRequest| create_batch_impl());
}

fn create_batch_impl() -> CreateBatchResponse {
    CHUNKS.with(|chunks| chunks.borrow_mut().delete_expired());
    BATCHES.with(|batches| {
        let mut batches = batches.borrow_mut();
        batches.delete_expired();
        let batch = batches.create();
        CreateBatchResponse {
            batch_id: batch.get_batch_id()
        }
    })
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateChunkRequest {
    batch_id: BatchId,
    #[serde(with = "serde_bytes")]
    content: Vec<u8>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateChunkResponse {
    chunk_id: ChunkId,
}

#[export_name = "canister_update create_chunk"]
pub fn create_chunk() {
    over(candid_one, create_chunk_impl);
}

fn create_chunk_impl(request: CreateChunkRequest) -> CreateChunkResponse {
    let caller = dfn_core::api::caller();
    if !is_safe(caller) {
        panic!("not authorized");
    }

    let chunk_id = BATCHES.with(|batches| {
        let mut batches = batches.borrow_mut();
        match batches.get_mut(request.batch_id) {
            Some(batch) => {
                CHUNKS.with(|chunks| chunks.borrow_mut().create(batch, request.content))
            },
            None => panic!("batch not found"),
        }
    });

    CreateChunkResponse {
        chunk_id
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CommitBatchRequest {
    batch_id: BatchId,
    operations: Vec<BatchOperationKind>
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub enum BatchOperationKind {
    Clear(ClearArguments),
    CreateAsset(CreateAssetArguments),
    DeleteAsset(DeleteAssetArguments),
    SetAssetContent(SetAssetContentArguments),
    UnsetAssetContent(UnsetAssetContentArguments)
}

#[export_name = "canister_update commit_batch"]
pub fn commit_batch() {
    over(candid_one, commit_batch_impl);
}

fn commit_batch_impl(request: CommitBatchRequest) {
    let caller = dfn_core::api::caller();
    if !is_safe(caller) {
        panic!("not authorized");
    }

    let batch_id = request.batch_id;
    for op in request.operations.into_iter() {
        let result: Result<(), String> = match op {
            BatchOperationKind::CreateAsset(args) => create_asset(args),
            BatchOperationKind::SetAssetContent(args) => set_asset_content(args),
            BatchOperationKind::UnsetAssetContent(args) => unset_asset_content(args),
            BatchOperationKind::DeleteAsset(args) => delete_asset(args),
            BatchOperationKind::Clear(args) => do_clear(args),
        };
        if result.is_err() {
            panic!("{}", result.unwrap_err());
        }
    };
    BATCHES.with(|batches| batches.borrow_mut().delete(batch_id));
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CreateAssetArguments {
    content_type: String,
    key: String
}

fn create_asset(args: CreateAssetArguments) -> Result<(), String> {
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        match assets.get_mut(&args.key) {
            Some(asset) => {
                if asset.get_content_type() != args.content_type {
                    return Err("create_asset: content type mismatch".to_string());
                }
            },
            None => {
                let asset = Asset::new(args.content_type, HashMap::new());
                assets.insert(args.key, asset);
            }
        }
        Ok(())
    })
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SetAssetContentArguments {
    chunk_ids: Vec<ChunkId>,
    content_encoding: String,
    key: String,
    sha256: Option<[u8; 32]>
}

fn set_asset_content(args: SetAssetContentArguments) -> Result<(), String> {
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        if let Some(asset) = assets.get_mut(&args.key) {
            CHUNKS.with(|all_chunks| {
                let mut all_chunks = all_chunks.borrow_mut();
                let chunks = args.chunk_ids.into_iter().map(|c| all_chunks.take(c).unwrap()).collect();

                if !chunk_lengths_match(&chunks) {
                    Err(format!("{} ({}): chunk lengths do not match the size of the first chunk", args.key, args.content_encoding))
                } else if chunks.is_empty() {
                    Err(format!("{} ({}): must have at least one chunk", args.key, args.content_encoding))
                } else {
                    let total_length = chunks.iter().map(|c| c.len() as u32).sum();
                    let encoding = AssetEncoding::new(
                        args.content_encoding.clone(),
                        chunks.concat(),
                        total_length,
                        args.sha256);
                    asset.set_encoding(args.content_encoding, encoding);
                    Ok(())
                }
            })
        } else {
            Err("asset not found".to_string())
        }
    })
}

fn chunk_lengths_match(chunks: &Vec<Vec<u8>>) -> bool {
    if chunks.len() > 2 {
        let expected_length = chunks[0].len();
        for i in 1..chunks.len() - 1 {
            if chunks[i].len() != expected_length {
                return false;
            }
        }
    }
    true
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UnsetAssetContentArguments {
    content_encoding: String,
    key: String
}

fn unset_asset_content(args: UnsetAssetContentArguments) -> Result<(), String> {
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        match assets.get_mut(&args.key) {
            Some(asset) => {
                asset.unset_encoding(&args.content_encoding);
                Ok(())
            },
            None => Err("asset not found".to_string())
        }
    })
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DeleteAssetArguments {
    key: String
}

fn delete_asset(args: DeleteAssetArguments) -> Result<(), String> {
    ASSETS.with(|assets| {
        let mut assets = assets.borrow_mut();
        assets.remove(&args.key);
    });
    Ok(())
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ClearArguments {}

fn do_clear(_: ClearArguments) -> Result<(), String> {
    ASSETS.with(|assets| assets.replace(HashMap::new()));
    BATCHES.with(|batches| batches.borrow_mut().clear());
    CHUNKS.with(|chunks| chunks.borrow_mut().reset());
    Ok(())
}

#[export_name = "canister_query http_request"]
pub fn http_request() {
    over(candid_one, http_request_impl);
}

fn is_safe(caller: PrincipalId) -> bool {
    AUTHORIZED.with(|authorized| {
        if authorized.borrow().is_empty() {
            return true;
        }

        if !authorized
            .borrow()
            .iter()
            .any(|a| a == &caller) {
            panic!("{:?}, {:?}", authorized.borrow(), &caller);
        }
        true
    })
}
