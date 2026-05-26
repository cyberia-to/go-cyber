// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
use crate::tokenfactory::types::Metadata;
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Binary, StdResult, Uint128};

/// Special messages to be supported by any chain that supports token_factory
#[cw_serde]
pub enum TokenFactoryMsg {
    /// CreateDenom creates a new factory denom, of denomination:
    /// factory/{creating contract bech32 address}/{Subdenom}
    /// Subdenom can be of length at most 44 characters, in [0-9a-zA-Z./]
    /// Empty subdenoms are valid.
    /// The (creating contract address, subdenom) pair must be unique.
    /// The created denom's admin is the creating contract address,
    /// but this admin can be changed using the UpdateAdmin binding.
    ///
    /// If you set an initial metadata here, this is equivalent
    /// to calling SetMetadata directly on the returned denom.
    CreateDenom {
        subdenom: String,
        metadata: Option<Metadata>,
    },
    /// ChangeAdmin changes the admin for a factory denom.
    /// Can only be called by the current contract admin.
    /// If the NewAdminAddress is empty, the denom will have no admin.
    ChangeAdmin {
        denom: String,
        new_admin_address: String,
    },
    /// Contracts can mint native tokens for an existing factory denom
    /// that they are the admin of.
    MintTokens {
        denom: String,
        amount: Uint128,
        mint_to_address: String,
    },
    /// Contracts can burn native tokens for an existing factory denom
    /// tshat they are the admin of.
    BurnTokens {
        denom: String,
        amount: Uint128,
        burn_from_address: String,
    },
    /// Contracts can force transfer tokens for an existing factory denom
    /// that they are the admin of.
    ForceTransfer {
        denom: String,
        amount: Uint128,
        from_address: String,
        to_address: String,
    },
    SetMetadata {
        denom: String,
        metadata: Metadata,
    },
}

/// This is in the data field in the reply from a TokenFactoryMsg::CreateDenom SubMsg
/// Custom code to parse from protobuf with minimal wasm bytecode bloat
pub struct CreateDenomResponse {
    pub new_token_denom: String,
}

impl CreateDenomResponse {
    /// Call this to process data field from the SubMsg data field
    pub fn from_reply_data(data: Binary) -> StdResult<Self> {
        // Manual protobuf decoding
        let mut data = Vec::from(data);
        // Parse contract addr
        let new_token_denom = copied_from_cw_utils::parse_protobuf_string(&mut data, 1)?;
        Ok(CreateDenomResponse { new_token_denom })
    }

    pub fn encode(&self) -> StdResult<Binary> {
        // Protobuf field 1 (string), wire type 2 (length-delimited)
        let denom_bytes = self.new_token_denom.as_bytes();
        let mut buf = Vec::with_capacity(1 + 1 + denom_bytes.len());
        buf.push((1 << 3) | 2); // field 1, wire type 2
        buf.push(denom_bytes.len() as u8);
        buf.extend_from_slice(denom_bytes);
        Ok(Binary::from(buf))
    }
}

// Copied from cw_utils internals (not publicly exported in cw_utils 1.x).
mod copied_from_cw_utils {
    use cosmwasm_std::{StdError, StdResult};

    // Protobuf wire types (https://developers.google.com/protocol-buffers/docs/encoding)
    const WIRE_TYPE_LENGTH_DELIMITED: u8 = 2;
    // Up to 9 bytes of varints as a practical limit (https://github.com/multiformats/unsigned-varint#practical-maximum-of-9-bytes-for-security)
    const VARINT_MAX_BYTES: usize = 9;

    pub(super) fn parse_protobuf_string(data: &mut Vec<u8>, field_number: u8) -> StdResult<String> {
        let str_field = parse_protobuf_length_prefixed(data, field_number)?;
        Ok(String::from_utf8(str_field)?)
    }

    /// Helper function to parse length-prefixed protobuf fields.
    /// The remaining of the data is kept in the data parameter.
    fn parse_protobuf_length_prefixed(data: &mut Vec<u8>, field_number: u8) -> StdResult<Vec<u8>> {
        if data.is_empty() {
            return Ok(vec![]);
        };
        let mut rest_1 = data.split_off(1);
        let wire_type = data[0] & 0b11;
        let field = data[0] >> 3;

        if field != field_number {
            return Err(StdError::parse_err(
                "length_prefix_field",
                format!(
                    "failed to decode Protobuf message: invalid field #{} for field #{}",
                    field, field_number
                ),
            ));
        }
        if wire_type != WIRE_TYPE_LENGTH_DELIMITED {
            return Err(StdError::parse_err(
                "length_prefix_field",
                format!(
                    "failed to decode Protobuf message: field #{}: invalid wire type {}",
                    field_number, wire_type
                ),
            ));
        }

        let len = parse_protobuf_varint(&mut rest_1, field_number)?;
        if rest_1.len() < len {
            return Err(StdError::parse_err(
                "length_prefix_field",
                format!(
                    "failed to decode Protobuf message: field #{}: message too short",
                    field_number
                ),
            ));
        }
        *data = rest_1.split_off(len);

        Ok(rest_1)
    }

    /// Base128 varint decoding.
    /// The remaining of the data is kept in the data parameter.
    fn parse_protobuf_varint(data: &mut Vec<u8>, field_number: u8) -> StdResult<usize> {
        let data_len = data.len();
        let mut len: u64 = 0;
        let mut i = 0;
        while i < VARINT_MAX_BYTES {
            if data_len == i {
                return Err(StdError::parse_err(
                    "varint",
                    format!(
                        "failed to decode Protobuf message: field #{}: varint data too short",
                        field_number
                    ),
                ));
            }
            len += ((data[i] & 0x7f) as u64) << (i * 7);
            if data[i] & 0x80 == 0 {
                break;
            }
            i += 1;
        }
        if i == VARINT_MAX_BYTES {
            return Err(StdError::parse_err(
                "varint",
                format!(
                    "failed to decode Protobuf message: field #{}: varint data too long",
                    field_number
                ),
            ));
        }
        *data = data[i + 1..].to_owned();

        Ok(len as usize) // Gently fall back to the arch's max addressable size
    }
}
