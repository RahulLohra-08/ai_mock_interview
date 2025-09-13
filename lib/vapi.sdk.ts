import Vapi from '@vapi-ai/web'

export const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN!);//! iska matlab ye hai ki ye value kabhi null ya undefined nahi hogi, env variable ko access karte waqt typescript ko batane ke liye use karte hain ki ye hai.