// ---
// tags: cw-cyber, rust
// crystal-type: source
// crystal-domain: cyber
// ---
#[cfg(test)]
mod tests {
    use crate::contract::{execute, instantiate, query};
    use crate::execute::*;
    use crate::msg::*;
    use crate::query::{query_admins, query_particles, query_total_particles};
    use crate::ContractError;
    use cosmwasm_std::from_json;
    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};

    #[test]
    fn proper_flow() {
        let mut deps = mock_dependencies();

        let owner = "owner";
        let instantiate_msg = InstantiateMsg {
            admins: vec![
                "owner".to_string(),
                "admin1".to_string(),
                "admin2".to_string(),
            ],
        };

        let info = mock_info(&owner, &[]);
        instantiate(deps.as_mut(), mock_env(), info, instantiate_msg).unwrap();

        let expected_config = vec![
            "owner".to_string(),
            "admin1".to_string(),
            "admin2".to_string(),
        ];
        assert_eq!(query_admins(deps.as_ref()).unwrap(), expected_config);

        let update_admins_msg = ExecuteMsg::UpdateAdmins {
            admins: vec![
                "owner".to_string(),
                "admin1".to_string(),
                "admin3".to_string(),
            ],
        };
        let info = mock_info("admin1", &[]);
        execute(deps.as_mut(), mock_env(), info, update_admins_msg).unwrap();

        let expected_config = vec![
            "owner".to_string(),
            "admin1".to_string(),
            "admin3".to_string(),
        ];
        assert_eq!(query_admins(deps.as_ref()).unwrap(), expected_config);

        let add_particles_msg = ExecuteMsg::AddParticles {
            particles: vec![
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe1".to_string(),
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2".to_string(),
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3".to_string(),
            ],
        };
        let info = mock_info("admin3", &[]);
        execute(deps.as_mut(), mock_env(), info, add_particles_msg).unwrap();
        assert_eq!(query_total_particles(deps.as_ref()).unwrap(), 3);

        let query_particles_msg = QueryMsg::Particles {
            start_after: None,
            limit: None,
        };
        let query_particle_response =
            query(deps.as_ref(), mock_env(), query_particles_msg).unwrap();
        let particles: Vec<(u32, String)> = from_json(&query_particle_response).unwrap();
        assert_eq!(
            particles,
            vec![
                (
                    1,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe1".to_string()
                ),
                (
                    2,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2".to_string()
                ),
                (
                    3,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3".to_string()
                ),
            ]
        );

        let add_particles_msg = ExecuteMsg::AddParticles {
            particles: vec![
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4".to_string(),
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe5".to_string(),
                "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe6".to_string(),
            ],
        };
        let info = mock_info("admin1", &[]);
        execute(deps.as_mut(), mock_env(), info, add_particles_msg).unwrap();
        assert_eq!(query_total_particles(deps.as_ref()).unwrap(), 6);

        let delete_particles_msg = ExecuteMsg::DeleteParticles {
            particles: vec![1, 6],
        };
        let info = mock_info("admin3", &[]);
        execute(deps.as_mut(), mock_env(), info, delete_particles_msg).unwrap();
        assert_eq!(query_total_particles(deps.as_ref()).unwrap(), 4);

        let query_particles_msg = QueryMsg::Particles {
            start_after: None,
            limit: None,
        };
        let query_particle_response =
            query(deps.as_ref(), mock_env(), query_particles_msg).unwrap();
        let particles: Vec<(u32, String)> = from_json(&query_particle_response).unwrap();
        assert_eq!(
            particles,
            vec![
                (
                    2,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe2".to_string()
                ),
                (
                    3,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3".to_string()
                ),
                (
                    4,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4".to_string()
                ),
                (
                    5,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe5".to_string()
                ),
            ]
        );

        let query_head_id_response = query(deps.as_ref(), mock_env(), QueryMsg::HeadId {}).unwrap();
        let head_id: u32 = from_json(&query_head_id_response).unwrap();
        assert_eq!(head_id, 6);
        assert_eq!(query_total_particles(deps.as_ref()).unwrap(), 4);

        let query_particles_msg = QueryMsg::Particles {
            start_after: Some(2),
            limit: Some(2),
        };
        let query_particle_response =
            query(deps.as_ref(), mock_env(), query_particles_msg).unwrap();
        let particles: Vec<(u32, String)> = from_json(&query_particle_response).unwrap();
        assert_eq!(
            particles,
            vec![
                (
                    3,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe3".to_string()
                ),
                (
                    4,
                    "QmUX9mt8ftaHcn9Nc6SR4j9MsKkYfkcZqkfPTmMmBgeTe4".to_string()
                ),
            ]
        );
    }
}
