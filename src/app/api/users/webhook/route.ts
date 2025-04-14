import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyWebhook } from "@clerk/nextjs/webhooks"

// export async function POST(req: Request){
//     const SIGNING_SECRET = process.env.CLERK_SIGNING_SECRET

//     if(!SIGNING_SECRET){
//         throw new Error("Error: Please add CLERK_SIGNING_SECRET from clerk dashboard to .env or .env.local")
//     }

//     const wh = new Webhook(SIGNING_SECRET)

//     const headerPayload = await headers()
//     const svix_id = headerPayload.get("svix-id")
//     const svix_timestamp = headerPayload.get("svix_timestamp")
//     const svix_signature = headerPayload.get("svix_signature")

//     if(!svix_id || !svix_signature || !svix_timestamp){
//         return new Response("Error: Missing Svix headers", {
//             status: 400
//         })
//     }

//     const payload = await req.json()
//     const body = JSON.stringify(payload)

//     let evt: WebhookEvent

//     try{
//         evt = wh.verify(body, {
//             "svix-id": svix_id,
//             "svix-timestamp": svix_timestamp,
//             "svix-signature": svix_signature
//         }) as WebhookEvent
//     } catch (err) {
//         console.error("Error: Could not verify webhook: ", err)
//         return new Response("Error: Verification error", {
//             status: 400
//         })
//     }

//     const { id } = evt.data
//     const eventType = evt.type
//     console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
//     console.log(`Webhook payload: `, body)


    

//     return new Response("Webhook received", {status: 200})
// }

export async function POST(req: Request) {
  try {
    const evt = await verifyWebhook(req)

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    // if the user is created, sync our database and add the user in the database
    if(eventType === "user.created") {
        const { data } = evt
        // const name = !data.first_name ? data.email_addresses[0].email_address
        await db.insert(users).values({
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url
        })
    }

    //if the user is deleted
    if(eventType === "user.deleted"){
        const { data } = evt
        if(!data.id){
            return new Response("Missing user id", {status: 400})
        }
        await db.delete(users).where(eq(users.clerkId, data.id))
    }

    //if the user is updated
    if(eventType === "user.updated"){
        const {data} = evt

        await db.update(users)
        .set({
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url
        })
        .where(eq(users.clerkId, data.id))
    }

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}