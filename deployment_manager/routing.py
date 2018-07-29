from channels import route
from deployment_manager.consumers import ws_connect, ws_disconnect, ws_receive

websocket_routing = [
	# called when websocket connect
	route("websocket.connect", ws_connect),

	# called when websocket disconnects
	route("websocket.disconnect", ws_disconnect),

	# called when websocket gets sent data
	route("websocket.receive", ws_receive),
]
