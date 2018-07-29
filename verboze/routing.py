from channels import include
from api.routing import websocket_routing as api_ws_routing
from deployment_manager.routing import websocket_routing as deployment_manager_ws_routing

channel_routing = [
	include(api_ws_routing, path=r"^/stream/(?P<token>[a-zA-Z0-9-]+)"),
	include(deployment_manager_ws_routing, path=r'^/deployment-comm/(?P<token>[a-zA-Z0-9-]+)/(?P<deployment_manager>\w+|)')
]
