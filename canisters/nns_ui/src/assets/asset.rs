use std::collections::HashMap;
use candid::CandidType;
use serde::Deserialize;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct AssetEncoding {
    content_encoding: String,
    #[serde(with = "serde_bytes")]
    content: Vec<u8>,
    total_length: u32,
    sha256: Option<[u8; 32]>
}

impl AssetEncoding {
    pub fn new(content_encoding: String, content: Vec<u8>, total_length: u32, sha256: Option<[u8; 32]>) -> AssetEncoding {
        AssetEncoding {
            content_encoding,
            content,
            total_length,
            sha256
        }
    }

    pub fn get_content_encoding(&self) -> String {
        self.content_encoding.clone()
    }

    pub fn get_content(&self) -> Vec<u8> {
        self.content.clone()
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Asset {
    content_type: String,
    encodings: HashMap<String, AssetEncoding>
}

impl Asset {
    pub fn new(content_type: String, encodings: HashMap<String, AssetEncoding>) -> Asset {
        Asset {
            content_type,
            encodings
        }
    }

    pub fn choose_encoding(&self, accept_encodings: &Vec<String>) -> Option<AssetEncoding> {
        for accept_encoding in accept_encodings.iter() {
            if let Some(encoding) = self.encodings.get(accept_encoding) {
                return Some(encoding.clone());
            }
        }
        None
    }

    pub fn get_encoding(&self, encoding_type: &str) -> Option<AssetEncoding> {
        self.encodings.get(encoding_type).cloned()
    }

    pub fn set_encoding(&mut self, encoding_type: String, encoding: AssetEncoding) {
        self.encodings.insert(encoding_type, encoding);
    }

    pub fn unset_encoding(&mut self, encoding_type: &str) {
        self.encodings.remove(encoding_type);
    }

    pub fn encoding_entries(&self) -> Vec<(String, AssetEncoding)> {
        self.encodings.iter().map(|(key, value)| (key.clone(), value.clone())).collect()
    }

    pub fn to_asset_details(key: String, asset: &Asset) -> AssetDetails {
        AssetDetails {
            key,
            content_type: asset.content_type.clone(),
            encodings: asset.encodings.iter()
                .map(|(k, v)| AssetEncodingDetails {
                    content_encoding: k.clone(),
                    length: v.total_length,
                    sha256: v.sha256
                })
                .collect()
        }
    }

    pub fn get_content_type(&self) -> String {
        self.content_type.clone()
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct AssetEncodingDetails {
    content_encoding: String,
    length: u32,
    sha256: Option<[u8; 32]>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct AssetDetails {
    key: String,
    content_type: String,
    encodings: Vec<AssetEncodingDetails>,
}
