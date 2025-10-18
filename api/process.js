import { S3Client, GetObjectCommand,DeleteObjectCommand } from "@aws-sdk/client-s3";


import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
const baseUrl = "https://api.assemblyai.com";
const headers = {
  authorization: process.env.ASSEMBLYAI_API,
}; 
const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

export async function getDownloadUrl(bucket_value, filepath)
{
  const command = new GetObjectCommand({
    Bucket: bucket_value,
    Key: filepath, 
  });

  return  await getSignedUrl(client, command, { expiresIn: 3600 }); 
}
export async function deleteFile(bucket_value, filepath) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket_value,
      Key: filepath,
    });
    await client.send(command);
    console.log(`Deleted ${filepath} from ${bucket_value}`);
  } catch (err) {
    console.error("Error deleting file:", err);
  }
}

async function transcribe(assembly_url)
    {
   try 
   {   
      const audioFile = assembly_url;
      const data = {
         audio_url: audioFile,
         language_detection: true
      };
    const url = `${baseUrl}/v2/transcript`;
    let transcriptId;
    try 
    {
      const transcriptResponse = await axios.post(url, data, { headers });
      transcriptId = transcriptResponse.data.id;
    } 
    catch (error)
    {
      console.error(
        "Error from POST '/transcript' request:",
        error.response.data.error || error
      );
    }
    const pollingEndpoint = `${baseUrl}/v2/transcript/${transcriptId}`;
    while (true) 
    {
      const pollingResponse = await axios.get(pollingEndpoint, { headers });
      const transcriptionResult = pollingResponse.data;
      if (transcriptionResult.status === "completed") {
        return transcriptionResult;
    } 
    else if (transcriptionResult.status === "error") 
    {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
    } 
    else 
    {
        await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    }
  } 
  catch (error) 
  {
    console.error(error.message);
  }
}

export default async function Convert_Data(req,res) {
  try 
  {
    if(req.method != "POST")
    {
     return res.status(405).json({ error: 'Method not allowed'});
    }
   const {bucket_value,filepath} = req.body;
   if(!filepath || !bucket_value)
   {
    return res.status(400).json({error:'Bad Request'});
   }
   const signedUrl = await getDownloadUrl(bucket_value,filepath);
   const transcriptionResult = await transcribe(signedUrl);
   const {text} = transcriptionResult;
   await deleteFile(bucket_value, filepath);
   return res.status(200).send(text);
  } 
  catch (error)
  {
     return res.status(500).json({error:'The server encountered a runtime crash'});
  }
}


