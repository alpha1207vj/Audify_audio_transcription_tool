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
        const url = 'api/transcribe';
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
            const signedUrL = await response.text();
        } 
        catch (error) {
            console.error(error.message);
        }
    }
)