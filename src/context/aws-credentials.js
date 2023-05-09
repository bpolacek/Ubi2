import { Config } from "aws-sdk";
import { Amplify, Auth, Storage } from 'aws-amplify';

Config.update({
  accessKeyId: "AKIAZ4MKDM6ZPW6AYNKP",
  secretAccessKey: "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",
  region: "us-east-2",
});

// Amplify.configure({
//     Auth: {
//       identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab', //REQUIRED - Amazon Cognito Identity Pool ID
//       region: 'XX-XXXX-X', // REQUIRED - Amazon Cognito Region
//       userPoolId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito User Pool ID
//       userPoolWebClientId: 'XX-XXXX-X_abcd1234', //OPTIONAL - Amazon Cognito Web Client ID
//     },
//     Storage: {
//       AWSS3: {
//         bucket: '', //REQUIRED -  Amazon S3 bucket name
//         region: 'XX-XXXX-X', //OPTIONAL -  Amazon service region
//       }
//     }
//   });