
def ws_connect(message):
	message.reply_channel.send({"accept": True})

def ws_receive(message):
	text = message.content.get('text')
	if text:
		message.reply_channel.send({"text": "You said: {}".format(text)})