# SSL Certificate files go here
# For Let's Encrypt:
# - cert.pem (your certificate)
# - key.pem (your private key)

# You can generate self-signed certificates for testing:
# openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#   -keyout key.pem -out cert.pem \
#   -subj "/C=US/ST=State/L=City/O=Organization/CN=yourdomain.com"