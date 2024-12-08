import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  useUnifiedTopology: true,
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  // clientPromise = client.connect();
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;
export default async function getClient() {
  return  clientPromise;
  // return client;
}
