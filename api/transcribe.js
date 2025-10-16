import { createClient} from '@supabase/supabase-js'
const supabase = createClient(process.env.SUPABASE_URL,process.env.SERVICE_ROLE_KEY);

  export default async function DataReceiver(req,res)
  {
  if (req.method != "POST" )
      return res.status(405).json({error : `Status : 405(Method not allowed)`});
  const {filepath} = req.body;
  if(!filepath)
  {
    console.error('No filepath received on the server.');
    return res.status(400).send('No file has been sent ');
  }
  const { data, error } = await supabase
  .storage
  .from('Guest_Users')
  .createSignedUploadUrl(filepath)
  if (error)
  {
    throw new Error(error.message);
  }else
  {
    const {signedUrl , path, token } = data;
    return res.json({signedUrl,token});
  }
}
 
