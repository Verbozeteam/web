
def add_gzip_encoding(headers, path, url):
	if path.endswith('.gz'):
		headers['Content-Encoding'] = 'gzip'
