registration using special code
add to ws refresh token logic

registration
host/auth/register
data: name: string, email: string, password: string

login
host/auth/login
data: email: string, password: string
(access token)

logout
host/auth/logout

ws
{sec-websocket-protocol: <token>}
