// Load the AWS SDK for Node.js
import AWS from 'aws-sdk';
import {REGION, BUCKET_NAME} from '../../constants/constants.js'
import { ListBucketsCommand, CreateBucketCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, PutBucketPolicyCommand, S3Client } from "@aws-sdk/client-s3";

// Set the region 
AWS.config.update({region: REGION});

const client = new S3Client({});

const checkIfBucketExists = async (bucketName) => {
  const command = new ListBucketsCommand({});

  try {
    const { Owner, Buckets } = await client.send(command);
    console.log(
      `${Owner.DisplayName} owns ${Buckets.length} bucket${
        Buckets.length === 1 ? "" : "s"
      }:`
    );
    console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
    for (var i in Buckets) {
      if(Buckets[i] === bucketName)
          return Buckets[i]
    }
    return null;
  } catch (err) {
    console.error(err);
  }
}

const createBucket = async () =>{
  const command = new CreateBucketCommand({
    // The name of the bucket. Bucket names are unique and have several other constraints.
    // See https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html
    Bucket: BUCKET_NAME,
  });

  try {
    const { Location } = await client.send(command);
    console.log(`Bucket created with location ${Location}`);
    await addReadBucketPolicy()
  } catch (err) {
    console.error(err);
  }
}


const addReadBucketPolicy = async () =>{
  const command = new PutBucketPolicyCommand({
    Policy: JSON.stringify({
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "AllowGetObject",
          // Allow this particular user to call GetObject on any object in this bucket.
          Effect: "Allow",
          Principal: "*",
          Action: "s3:GetObject",
          Resource: "arn:aws:s3:::"+BUCKET_NAME+"/*",
        },
      ],
    }),
    // Apply the preceding policy to this bucket.
    Bucket: BUCKET_NAME,
  });

  try {
    const response = await client.send(command);
    console.log("addReadBucketPolicy",response);
  } catch (err) {
    console.error(err);
  }
}


const createFile = async (content) => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: "TempFile.txt",
    Body: content,
  });

  try {
    const response = await client.send(command);
    console.log("File Creation",response);
    
    return "https://"+BUCKET_NAME+".s3.amazonaws.com/TempFile.txt"
  } catch (err) {
    console.error(err);
  }
};


const appendFile =  async(newContent) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: "TempFile.txt"
  });

  try {
    const response = await client.send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
    const str = await response.Body.transformToString();
    
    const newFileContent = str+newContent;
    const fileURL = await createFile(newFileContent);
    console.log(str);
    return fileURL;
  } catch (err) {
    console.error(err);
  }
};

const deleteFile = async (fileURL) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: "TempFile.txt",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
}
export {checkIfBucketExists, createBucket, createFile, appendFile, deleteFile};
