import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { join } from "path";
import { ProtoGrpcType } from "rpc/chat";
import { ChatServiceHandlers } from "rpc/chat_package/ChatService";

const packageDefinition = protoLoader.loadSync(join(__dirname, "./chat.proto"));

const proto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const handlers: ChatServiceHandlers = {
  Chat: (call, callback) => {
    const request = call.request;
    // console.log({ request });

    callback(null, {
      id: request.chatId,
      awnser: {
        id: request.chatId,
        message: request.message,
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    });
  },
};

const server = new grpc.Server();

server.addService(proto.chat_package.ChatService.service, handlers);

server.bindAsync(
  "0.0.0.0:5000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`Server is running on http://localhost:${port}`);
    server.start();
  }
);
