import { isIPv4 } from "net";
import { Node } from "../../core/models/Node";
import { SocketException } from "../../core/utils/SocketException";
import { UltraGridReceive, UltraGridSend, UltraGridStreamSettings } from "../models/UltraGrid";
import { XRITServiceID } from "../models/XRITServiceConfig";
import { Stream } from "../../core/models/Stream";

const ULTRAGRID_SEND_SERVICE_ID: XRITServiceID = "ULTRAGRID_SEND";
const ULTRAGRID_RECEIVE_SERVICE_ID: XRITServiceID = "ULTRAGRID_RECEIVE";

export function addUltraGridSendStreamTarget(source_node: Node, stream: Stream, target_ip: string, settings: UltraGridSend) {
    if (!stream?.settings) throw new SocketException('Stream settings are not defined.')
    const stream_type = (stream.settings as UltraGridStreamSettings).stream_type

    if (!stream_type || (stream_type != "VIDEO" && stream_type != "AUDIO")) throw new SocketException("UltraGrid stream type is not defined.")
    if (!isIPv4(target_ip)) throw new SocketException(`${target_ip} is not a valid IPv4. Cannot create stream.`)

    if (stream_type === "VIDEO") {
        if (!settings.video.compression || !settings.video.resolution || !settings.video.frame_rate || !settings.video.codec || !settings.video.source_name)
            throw new SocketException("Must define UltraGrid Send settings before creating a video stream.");

        source_node.emit(`${ULTRAGRID_SEND_SERVICE_ID}:add-video-stream-target`, stream.id, target_ip, settings.video);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_SEND_SERVICE_ID}:add-video-stream-target\x1b[0m to \x1b[36m${source_node.machine_alias}...\n\x1b[0m`);
    } else {
        if (!settings.audio.compression || !settings.audio.codec || !settings.audio.source_name)
            throw new SocketException("Must define UltraGrid Send settings before creating an audio stream.");

        source_node.emit(`${ULTRAGRID_SEND_SERVICE_ID}:add-audio-stream-target`, stream.id, target_ip, settings.audio);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_SEND_SERVICE_ID}:add-audio-stream-target\x1b[0m to \x1b[36m${source_node.machine_alias}...\n\x1b[0m`);
    }
}

export function removeUltraGridSendStreamTarget(source_node: Node, stream: Stream, target_ip: string) {
    if (!stream?.settings) throw new SocketException('Stream settings are not defined.')
    const stream_type = (stream.settings as UltraGridStreamSettings).stream_type

    if (!stream_type || (stream_type != "VIDEO" && stream_type != "AUDIO")) throw new SocketException("UltraGrid stream type is not defined.")
    if (!isIPv4(target_ip)) throw new SocketException(`${target_ip} is not a valid IPv4. Cannot remove stream.`)

    if (stream_type === "VIDEO") {
        source_node.emit(`${ULTRAGRID_SEND_SERVICE_ID}:remove-video-stream-target`, stream.id, target_ip);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_SEND_SERVICE_ID}:remove-video-stream-target\x1b[0m to \x1b[36m${source_node.machine_alias}...\n\x1b[0m`);
    } else {
        source_node.emit(`${ULTRAGRID_SEND_SERVICE_ID}:remove-audio-stream-target`, stream.id, target_ip);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_SEND_SERVICE_ID}:remove-audio-stream-target\x1b[0m to \x1b[36m${source_node.machine_alias}...\n\x1b[0m`);
    }
}

export function addUltraGridReceiveStreamSource(target_node: Node, stream: Stream, source_ip: string, settings: UltraGridReceive) {
    if (!stream?.settings) throw new SocketException('Stream settings are not defined.')
    const stream_type = (stream.settings as UltraGridStreamSettings).stream_type

    if (!stream_type || (stream_type != "VIDEO" && stream_type != "AUDIO")) throw new SocketException("UltraGrid stream type is not defined.")
    if (!isIPv4(source_ip)) throw new SocketException(`${source_ip} is not a valid IPv4. Cannot create stream.`)

    if (stream_type === "VIDEO") {
        if (!settings.video_output)
            throw new SocketException("Must define UltraGrid Recieve video output before creating stream.");

        target_node.emit(`${ULTRAGRID_RECEIVE_SERVICE_ID}:add-video-stream-source`, stream.id, source_ip, settings.video_output);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_RECEIVE_SERVICE_ID}:add-video-stream-source\x1b[0m to \x1b[36m${target_node.machine_alias}...\n\x1b[0m`);
    } else {
        if (!settings.audio_output)
            throw new SocketException("Must define UltraGrid Recieve audio output before creating stream.");

        target_node.emit(`${ULTRAGRID_RECEIVE_SERVICE_ID}:add-audio-stream-source`, stream.id, source_ip, settings.audio_output);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_RECEIVE_SERVICE_ID}:add-audio-stream-source\x1b[0m to \x1b[36m${target_node.machine_alias}...\n\x1b[0m`);
    }
}

export function removeUltraGridReceiveStreamSource(target_node: Node, stream: Stream, source_ip: string) {
    if (!stream?.settings) throw new SocketException('Stream settings are not defined.')
    const stream_type = (stream.settings as UltraGridStreamSettings).stream_type

    if (!stream_type || (stream_type != "VIDEO" && stream_type != "AUDIO")) throw new SocketException("UltraGrid stream type is not defined.")
    if (!isIPv4(source_ip)) throw new SocketException(`${source_ip} is not a valid IPv4. Cannot remove stream.`)
    if (stream_type === "VIDEO") {
        target_node.emit(`${ULTRAGRID_RECEIVE_SERVICE_ID}:remove-video-stream-source`, stream.id, source_ip);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_RECEIVE_SERVICE_ID}:remove-video-stream-source\x1b[0m to \x1b[36m${target_node.machine_alias}...\n\x1b[0m`);
    } else {
        target_node.emit(`${ULTRAGRID_RECEIVE_SERVICE_ID}:remove-audio-stream-source`, stream.id, source_ip);
        console.log(`Sent request \x1b[36m\x1b[1m${ULTRAGRID_RECEIVE_SERVICE_ID}:remove-audio-stream-source\x1b[0m to \x1b[36m${target_node.machine_alias}...\n\x1b[0m`);
    }
}