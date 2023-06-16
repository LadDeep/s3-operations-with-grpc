## Overview

I've built a gRPC server, deployed on an EC2 instance, which interacted with a web application to perform various operations on AWS S3 storage.

## Task Details

I constructed a gRPC server using a using JavaScript, deployed on an EC2 instance. I utilized the official gRPC documentation's quick start guides to create gRPC methods. I was provided with Protocol Buffers code to be used for my gRPC server, saved in a file named [computeandstorage.proto](./computeandstorage.proto).

The provided protobuf contained service definitions and messages for the following operations:

1. StoreData
2. AppendData
3. DeleteFile


Demonstrated the following skills and understanding:

- Launching AWS EC2 instances and provisioning them for web applications.
- Working with AWS Simple Storage Service (S3), including bucket creation, applying appropriate policies and file operations.
- Experience using AWS libraries like `aws-sdk` to execute AWS operations, such as file creation on S3 and managing policies.
- Building APIs and handling gRPC methods.
