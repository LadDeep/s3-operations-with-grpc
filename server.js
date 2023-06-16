
import {BUCKET_NAME} from './constants/constants.js'
import {checkIfBucketExists, createBucket, createFile, appendFile, deleteFile} from './utils/s3/helper.js'
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
    
// Suggested options for similarity to existing grpc.load behavior
const packageDefinition = protoLoader.loadSync('./computeandstorage.proto', {});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const EC2computeAndStoragePackage = protoDescriptor.computeandstorage;


const server = new grpc.Server();
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), ()=>{server.start()});
server.addService(EC2computeAndStoragePackage.EC2Operations.service,
    {
        "StoreData": StoreData,
        "AppendData": AppendData,
        "DeleteFile": DeleteFile,
        
    }
);
    
async function StoreData( call, callback ){
    const bucket = await checkIfBucketExists(BUCKET_NAME)
    
    if(bucket===null)
        await createBucket();
        
    const fileContent = call.request.data;
    
    const fileURL = await createFile(fileContent);
    
    callback(null, {"s3uri": fileURL})
    
    
}

async function AppendData( call, callback ){
    
    const fileContent = call.request.data;
    
    await appendFile(fileContent);
    
    callback(null, {});
}

async function DeleteFile ( call, callback ){
    
    const fileURL = call.request.s3uri;
    
    await deleteFile(fileURL);
    
    callback(null, {})
}
