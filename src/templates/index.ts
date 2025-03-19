export const checkWalletTemplate = `Given the recent messages below:

{{recentMessages}}

Extract the wallet address mentioned in the messages. The address must meet one of the following conditions:

A valid Ethereum address that starts with "0x".
If no valid address is found, return an empty string ("").

Response Format
Respond with a JSON markdown block containing only the extracted value:

\`\`\`json
{ "address": string }
\`\`\`

Ensure the response contains only the JSON block with no additional text.
`;

export const sendTokenTemplate = `Given the recent messages below:

{{recentMessages}}

Extract the following information from the messages:

- Amount to send (e.g., "0.01" or "1"). This should be the number before the token symbol (e.g., ETH).
- Token symbol (e.g., "ETH", "USDT"). This should be the token symbol mentioned in the message.
- Recipient address. This should be a valid Ethereum address starting with "0x".

If any of the fields are missing, return ("") for that field.

Response Format
Respond with a JSON markdown block containing only the extracted values:

\`\`\`json
{
    "amount": string,
    "symbol": string,
    "recipient": string
}
\`\`\`

Ensure the response contains only the JSON block with no additional text.
`;

