const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const USER_PROTO_PATH = "./proto/user.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(USER_PROTO_PATH, options);

const UserRepository = grpc.loadPackageDefinition(packageDefinition).UserRepository;

const userGrpcClient = new UserRepository(
  process.env.GRPC_HOSTNAME,
  grpc.credentials.createInsecure()
);

module.exports = userGrpcClient;