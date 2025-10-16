const fileInput = document.querySelector('#audio_input');
const uploadButton = document.querySelector('.upload_button');
const convertButton = document.querySelector('.convert_button');
let filepath = '';

fileInput.addEventListener('change',()=>
{
    const filename = fileInput.files[0].name;
    filepath = `audio_buckets/${Date.now()}${filename}`;
    console.log(filepath + ' is uploaded!!!');
})
uploadButton.addEventListener('click', 
    async function sendUrlLink()
    {
        const url = '/api/transcribe';
        try 
        {
            const Myheaders = new Headers();
            Myheaders.append(
                "Content-type",
                "application/json"
            );
            const response = await fetch(url,
            {
              method: 'POST',
              headers :Myheaders ,
              body: JSON.stringify({filepath}),
            } );
            if (!response.ok)
            {
                throw new Error(
                    `Response Status :  ${response.status}`
                );
            }
            const {signedUrl,token}= await response.json();
            const upload_response = await fetch (signedUrl,
                {
                 method: "PUT",
                 headers : {
                             "Content-type" : (fileInput.files[0]).type
                           },
                 body : fileInput.files[0],
                }
            );
            if (!upload_response)
            {
                throw new Error (`This upload failed on the frontend`);
            }
            console.log('it is a success')
        } 
        catch (error) {
            console.error(error.message);
        }
    }
)
convertButton.addEventListener('click', 
    async function GettingTranscript()
    {
      const url = '/api/process/';
     try 
        {
            const Myheaders = new Headers();
            Myheaders.append(
                "Content-type",
                "application/json"
            );
            const response = await fetch(url,
            {
              method: 'POST',
              headers :Myheaders ,
              body: JSON.stringify({filepath}),
            } );
            if (!response.ok)
            {
                throw new Error(
                    `Response Status :  ${response.status}`
                );
            }
            const transcript_result= await response.text();
            console.log(transcript_result);
        } 
        catch (error) {
            console.error(error.message);
        }
    }
    
)