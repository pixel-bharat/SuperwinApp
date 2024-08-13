import React, { useEffect, useRef } from 'react';
import {
    View,
    Button
} from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import io from 'socket.io-client';

const socket = io.connect('http://YOUR_SERVER_IP:3000');

const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);

const Mic = () => {
    const localStream = useRef(null);

    useEffect(() => {
        // Getting local stream
        navigator.mediaDevices.getUserMedia({ audio: true, video: false })
            .then(stream => {
                localStream.current = stream;
                peerConnection.addStream(stream);
            })
            .catch(error => console.log(error));

        // Socket event handlers
        socket.on('offer', (data) => {
            handleOffer(data);
        });

        socket.on('answer', (data) => {
            handleAnswer(data);
        });

        socket.on('candidate', (data) => {
            handleCandidate(data);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleOffer = (offer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        peerConnection.createAnswer()
            .then(answer => {
                peerConnection.setLocalDescription(answer);
                socket.emit('answer', answer);
            });
    };

    const handleAnswer = (answer) => {
        peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = (candidate) => {
        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const createOffer = () => {
        peerConnection.createOffer()
            .then(offer => {
                peerConnection.setLocalDescription(offer);
                socket.emit('offer', offer);
            });
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('candidate', event.candidate);
        }
    };

    return (
        <View>
            <Button title="Start Call" onPress={createOffer} />
        </View>
    );
};

export default Mic;
