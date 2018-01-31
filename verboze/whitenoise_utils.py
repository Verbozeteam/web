
def add_gzip_encoding(headers, path, url):
	if path.endswith('.jgz'):
		headers['Content-Encoding'] = 'gzip'
