const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PRICING_PROTO_PATH = "./proto/pricing.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PRICING_PROTO_PATH, options);

const PricingRepository = grpc.loadPackageDefinition(packageDefinition).PricingRepository;

const pricingGrpcClient = new PricingRepository(
  process.env.GRPC_HOSTNAME,
  grpc.credentials.createInsecure()
);

module.exports = pricingGrpcClient;