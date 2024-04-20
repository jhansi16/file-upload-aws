# Project Title: Reactive Web UI with S3 Upload and DynamoDB Integration

## Description
This project is a responsive web UI built using ReactJS. It features a text input field and a file input field. Upon submission, the file is uploaded to Amazon S3, and the inputs along with S3 path are saved in DynamoDB. Additionally, a script is triggered on an EC2 instance to process the uploaded file.

## Project Setup

### Frontend Setup:
1. Clone this repository.
2. Navigate to the `frontend` directory.
3. Install dependencies using `npm install`.
4. Start the development server using `npm start`.

### Backend Setup:
1. Set up an API Gateway and Lambda function to handle requests from the frontend.
2. Create a DynamoDB table named `FileTable` with attributes: `id`, `input_text`, `input_file_path`, `output_file_path`.
3. Set up an S3 bucket to store input and output files.

### AWS Configuration (Frontend):
1. Open `src/App.js`.
2. Under the `AWS.config.update({ ... })` section, replace `"accessKeyId"` and `"secretAccessKey"` with your AWS Access Key ID and Secret Access Key respectively.

## Usage

1. **Input Form:**
    - Enter text into the text input field.
    - Select a file using the file input field.

2. **Submission:**
    - Click the submit button to initiate the upload process.

## Workflow

1. **Upload to S3:**
    - Upon submission, the file is uploaded directly to S3 from the browser.
    - S3 path: `[BucketName]/[InputFile].txt`

2. **Save Inputs to DynamoDB:**
    - The inputs (text input, input file path) along with the S3 path are saved in DynamoDB `FileTable`.

3. **Trigger Script on EC2:**
    - Upon successful upload to S3 and DynamoDB entry, a script is triggered on an EC2 instance via DynamoDB event.

4. **Script Execution:**
    - A new VM is automatically created.
    - The script is downloaded from S3 to the VM.
    - The script is executed in the VM.
    - Inputs are retrieved from DynamoDB FileTable by ID.
    - The input file is downloaded from S3 to the VM.
    - The input text is appended to the input file and saved as `[OutputFile].txt`.

5. **Upload Output to S3:**
    - The output file is uploaded to S3.
    - S3 path: `[BucketName]/[OutputFile].txt`

6. **Save Outputs to DynamoDB:**
    - The output file path along with other details are saved in DynamoDB `FileTable`.

7. **Terminate VM:**
    - The VM is automatically terminated after the process is completed.

## Notes

- Ensure proper IAM permissions are set for accessing S3, DynamoDB, EC2, and Lambda.
- Update the AWS region and other configurations as needed in the Lambda function, EC2 instance, and S3 bucket.
- It is recommended to encrypt sensitive data and manage access keys securely.
