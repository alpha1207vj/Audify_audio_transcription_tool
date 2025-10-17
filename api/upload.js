import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});
 export async function getUploadUrl(bucketName, objectKey)
 {
        const command = new PutObjectCommand
    ({
        Bucket: bucketName,
        Key: objectKey,
    });
    return await getSignedUrl(client, command, { expiresIn: 3600 });
}
export default async function Upload_data_Back(req,res)
{
    try 
    {
        if (req.method != 'POST')
          {
            return res.status(405).json({error: 'Method not allowed'})
          }

        const{bucket_value,filepath} = req.body;

        if(!bucket_value || !filepath )
          {
            return res.status(400).json({error: 'value_not_present'});
          }
        const url = await getUploadUrl(bucket_value,filepath);

        return res.status(200).send(url);

    } 
    catch (error)
    {
        return res.status(500).json({error:'The server encountered a runtime crash'});
    }
}