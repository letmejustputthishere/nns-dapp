use candid::CandidType;
use crate::assets::ASSETS;
use serde::Deserialize;

pub fn http_request_impl(request: HttpRequest) -> HttpResponse {
    let parts: Vec<&str> = request.url.split("?").collect();
    let asset_name = parts[0].to_string();
    let accept_encodings = get_accept_encodings(request.headers);

    ASSETS.with(|assets| {
        if let Some(asset) = assets.borrow().get(&asset_name) {
            if let Some(encoding) = asset.choose_encoding(&accept_encodings) {
                let content_encoding = encoding.get_content_encoding();
                let mut headers = Vec::new();
                headers.push(HeaderField { key: "Content-Type".to_string(), value: asset.get_content_type() });
                if content_encoding != "identity" {
                    headers.push(HeaderField { key: "Content-Encoding".to_string(), value: content_encoding });
                };
                return HttpResponse {
                    status_code: 200,
                    headers,
                    body: encoding.get_content(),
                }
            }
        }

        HttpResponse {
            status_code: 404,
            headers: vec![],
            body: format!("Asset '{}' not found.", asset_name).as_bytes().into(),
        }
    })
}

fn get_accept_encodings(headers: Vec<(String, String)>) -> Vec<String> {
    // TODO!
    vec!("identity".to_string())
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HeaderField {
    key: String,
    value: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpRequest {
    method: String,
    url: String,
    headers: Vec<(String, String)>,
    body: Vec<u8>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HttpResponse {
    status_code: u16,
    headers: Vec<HeaderField>,
    body: Vec<u8>,
}
