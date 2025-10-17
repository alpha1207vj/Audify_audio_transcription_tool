const fileInput = document.querySelector('#audio_input');
const uploadButton = document.querySelector('.upload_button');
const convertButton = document.querySelector('.convert_button');
let filepath = '';
let folder_value = 'transcription-bucket'; 
const bucket_value = 'guest-users';


fileInput.addEventListener('change',
    ()=>
    {
       
        filepath = `${folder_value}/${Date.now()}${fileInput.files[0].name}`;
        console.log(filepath);
    }
)

uploadButton.addEventListener('click',
    async function Upload_data_Front()
    {
        const url_upload_file = `/api/upload`;
        try 
        {
            const response = await fetch(url_upload_file, 
                {
                    method: 'POST',
                    headers: {
                        'Content-type' : "application/json"
                    },
                    body: JSON.stringify({bucket_value : 'guest-users',filepath : `${folder_value}/${Date.now()}${fileInput.files[0].name}`}),
                })

            if(!response.ok)
               {
                throw new Error(`Response status:${response.status}`)
               }
            const signedUrl = await response.text();
            const upload_time = await fetch(signedUrl,
                {
                    method: "PUT",
                    headers:{ "Content-type" : fileInput.files[0].type},
                    body: (fileInput.files[0])
                }
            )
            if(!upload_time)
            {
                throw new Error(`Response status: ${upload_time.status}`);
            }
            console.log('upload successful');
        } 
        catch (error) 
        {
            console.error(error.message);
        }
    }
)

convertButton.addEventListener('click',
    async function Convert_Data()
    {
      url_upload_file = `/api/process`;
      try 
      {
        const response = await fetch(url_upload_file,
        {
            method: "POST",
            headers:{ "Content-type" : application/json},
            body: JSON.stringify({
              filepath : `${folder_value}/${Date.now()}${fileInput.files[0].name}`
            })
        }
      )
      if (!response.ok)
      {
        throw new Error(`Response status: ${response.status}`);
      }
      const transcript_result = await response.text()
      console.log(transcript_result);
      } 
      catch (error)
      {
        
      }
      
    }
)