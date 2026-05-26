# Events

Each message handler emits an event with the message type and relevant attributes.

| Message | Event Type | Attributes |
|---|---|---|
| MsgCreateThought | `create_thought` | program, trigger, load, name, particle |
| MsgForgetThought | `forget_thought` | program, name |
| MsgChangeThoughtName | `change_thought_name` | program, name |
| MsgChangeThoughtParticle | `change_thought_particle` | program, name, particle |
| MsgChangeThoughtInput | `change_thought_input` | program, name, input |
| MsgChangeThoughtGasPrice | `change_thought_gas_price` | program, name, gas_price |
| MsgChangeThoughtPeriod | `change_thought_period` | program, name, period |
| MsgChangeThoughtBlock | `change_thought_block` | program, name, block |
