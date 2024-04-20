import AWS from "aws-sdk";
import { useState } from "react";

function App() {
  // State to store file and input text
  const [file, setFile] = useState(null);
  const [inputText, setInputText] = useState('');

  // Function to upload file to S3
  const uploadFile = async () => {
    const S3_BUCKET = "jhansi-file-upload-2";
    const REGION = "us-east-1";

    // It's crucial to remove or secure your AWS credentials from your client-side code.
    AWS.config.update({
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
    });

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file
    };

    try {
      const data = await s3.putObject(params).promise();
      console.log("File uploaded successfully.", data);
      // Construct the S3 file path
      const inputFilePath = `${encodeURIComponent(file.name)}`;
      // Now make a POST request to your server with the inputText and s3Path
      await postToServer(inputText, inputFilePath);
    } catch (error) {
      console.error("There was an error uploading the file: ", error);
    }
  };

  // Function to make POST request
  const postToServer = async (inputText, inputFilePath) => {
    try {
      console.log(inputText);
      console.log(inputFilePath);
      const response = await fetch('https://jl34dyz47j.execute-api.us-east-1.amazonaws.com/prod/file-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText, inputFilePath }),
      });
     // const responseData = await response.json();
     // console.log('POST request response: ', responseData);
      alert('Data sent to server successfully.');
    } catch (error) {
      console.error('Error in POST request: ', error);
    }
  };

  // Function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  // Function to handle input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  return (
    <div className="App">
      <div> Text input: 
        <input type="text" placeholder="Enter text" value={inputText} onChange={handleInputChange} /><br/><br/>
       File input: <input type="file" onChange={handleFileChange} />
      <br/> <br/> <button onClick={uploadFile}>Upload</button>
      </div>
    </div>
  );
}

export default App;