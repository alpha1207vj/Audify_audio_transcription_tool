import { createClient} from '@supabase/supabase-js'
import axios from "axios";
import fs from "fs-extra";

const supabase = createClient(process.env.SUPABASE_URL,process.env.SERVICE_ROLE_KEY); 
const baseUrl = "https://api.assemblyai.com";
const headers = {
  authorization: process.env.ASSEMBLYAI_API,
};


async function transcribe(signedUrl) {
  try {
    // Use a publicly accessible URL:
    const audioFile = signedUrl;
     const data = { audio_url: audioFile }
    const url = `${baseUrl}/v2/transcript`;
    let transcriptId;
    try {
      const transcriptResponse = await axios.post(url, data, { headers });
      transcriptId = transcriptResponse.data.id;
    } catch (error) {
      console.error(
        "Error from POST '/transcript' request:",
        error.response.data.error || error
      );
    }
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;
    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, { headers });
      const transcriptionResult = pollingResponse.data;
      if (transcriptionResult.status === "completed") {
        return transcriptionResult;
      } else if (transcriptionResult.status === "error") {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}



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
  .createSignedUrl(filepath,120)
  if (error)
  {
    throw new Error(error.message);
  }else
  {
    const {signedUrl} = data;
   const transcriptionResult = await transcribe(signedUrl);
   const {text} =  transcriptionResult;
   const { data, error } = await supabase
  .storage
  .from('Guest_Users')
  .remove(filepath)
  if (!error)
  {
    console.log(
        'DATA SUCCESSFULLY DELETED'
    );
  }
  else
  {
    console.log('issues for deletion process');
    return null;
  }
   return res.send(text);
  }
}
