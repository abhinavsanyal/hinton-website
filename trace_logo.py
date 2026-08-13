import cv2
import numpy as np

# Load the image with alpha channel
img = cv2.imread('public/assets/brand/hinton-studios-logo.png', cv2.IMREAD_UNCHANGED)

if img is None:
    print("Could not load image.")
    exit(1)

# Extract alpha channel
alpha = img[:, :, 3]

# Create binary image
_, thresh = cv2.threshold(alpha, 127, 255, cv2.THRESH_BINARY)

# Find contours
# RETR_TREE retrieves all contours and creates a full family hierarchy list
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

# Output SVG
height, width = thresh.shape
with open('public/assets/brand/h-mask-traced.svg', 'w') as f:
    f.write(f'<svg width="{width}" height="{height}" viewBox="0 0 {width} {height}" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd">\n')
    f.write('  <path fill="black" d="')
    
    for contour in contours:
        # Simplify contour to remove jaggies
        epsilon = 0.001 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        
        if len(approx) > 2:
            for j, point in enumerate(approx):
                x, y = point[0]
                command = 'M' if j == 0 else 'L'
                f.write(f'{command}{x},{y} ')
            f.write('Z ')
            
    f.write('" />\n')
    f.write('</svg>\n')

print("Traced SVG successfully.")
