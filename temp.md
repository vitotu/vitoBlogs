```json
{
    "outbounds": [
        {
            "mux": {
            },
            "protocol": "vmess",
            "sendThrough": "0.0.0.0",
            "settings": {
                "vnext": [
                    {
                        "address": "hkt.webredirect.org",
                        "port": 21011,
                        "users": [
                            {
                                "id": "bbf87e24-87de-3b33-9247-4b6b9b6409b4",
                                "security": "aes-128-gcm"
                            }
                        ]
                    }
                ]
            },
            "streamSettings": {
                "network": "ws",
                "tlsSettings": {
                    "disableSystemRoot": false
                },
                "wsSettings": {
                    "headers": {
                        "Host": "www.baidu.com"
                    },
                    "path": "/v2ray"
                },
                "xtlsSettings": {
                    "disableSystemRoot": false
                }
            },
            "tag": "PROXY"
        }
    ]
}

```