// import * as z from "zod"

// export const userAuthSchema = z.object({
//   email: z.string().email(),
// })
import * as z from "zod"

export const userAuthSchema = z.object({
 username: z.string(),
 password: z.string().min(5),
})