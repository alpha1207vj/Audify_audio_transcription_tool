import { createClient } from 'npm:@supabase/supabase-js@2';



export default async function DataReceiver(req,res)
{
 if (req.method != "POST" )
    return res.status.join(`Status : 405(Method not allowed)`);
 const {filepath} = req.body;
}
