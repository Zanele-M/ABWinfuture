import { useEffect, useState } from 'react';
var WEBSOCKET_URL = 'http://localhost:8080/';
export var useWebSocket = function () {
    var _a = useState(null), socket = _a[0], setSocket = _a[1];
    var _b = useState(null), data = _b[0], setData = _b[1];
    useEffect(function () {
        var ws = new WebSocket(WEBSOCKET_URL);
        ws.onopen = function () {
            console.log('WebSocket connected');
            setSocket(ws);
        };
        ws.onmessage = function (event) {
            var receivedData = JSON.parse(event.data);
            setData(receivedData);
        };
        ws.onerror = function (error) {
            console.error('WebSocket error:', error);
        };
        ws.onclose = function () {
            console.log('WebSocket disconnected');
            setSocket(null);
        };
        return function () {
            ws.close();
        };
    }, []);
    return { socket: socket, data: data };
};
