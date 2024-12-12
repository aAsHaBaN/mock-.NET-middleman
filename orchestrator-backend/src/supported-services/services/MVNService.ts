import { Node } from "../../core/models/Node";
import { Stream } from "../../core/models/Stream";
import { SocketException } from "../../core/utils/SocketException";
import { XRITServiceID } from "../models/XRITServiceConfig";

const MVN_SERVICE_ID: XRITServiceID = "MVN";

export function addMVNStreamTarget(mvn_node: Node, target_node: Node, stream: Stream) {
  toggleNetworkStreamTarget(mvn_node, target_node, stream, true);
}

export function removeMVNStreamTarget(mvn_node: Node, target_node: Node, stream: Stream) {
  toggleNetworkStreamTarget(mvn_node, target_node, stream, false);
}

function toggleNetworkStreamTarget(mvn_node: Node, target_node: Node, stream: Stream, to_create_stream: boolean) {
  if (!mvn_node.configurations.some((c) => c.software_id === MVN_SERVICE_ID))
    throw new SocketException(`Node ${mvn_node.id} does not support MVN.`);
  if (stream.target.entry_point.type.toLowerCase() != "port" || typeof stream.target.entry_point.value != "number")
    throw new SocketException(`Target entry point MVN stream must be a port`);

  const message = to_create_stream ? `${MVN_SERVICE_ID}:add-stream-target` : `${MVN_SERVICE_ID}:remove-stream-target`;
  const stream_id = stream.id;
  const mvn_stream_target = { ip: target_node.local_ip, port: stream.target.entry_point.value };

  mvn_node.emit(message, stream_id, mvn_stream_target);
  console.log(`Sent request \x1b[36m\x1b[1m${message}\x1b[0m to \x1b[36m${mvn_node.machine_alias}...\n\x1b[0m`);
}