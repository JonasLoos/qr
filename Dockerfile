# Use nginx to serve static files
FROM nginx:alpine

# Copy the web app files to nginx html directory
COPY index.html app.js qrcode.js styles.css /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
