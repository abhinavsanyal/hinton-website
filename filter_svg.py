import re

with open('public/assets/brand/h-mask.svg', 'r') as f:
    svg = f.read()

# Extract the d="" string
match = re.search(r'd="([^"]+)"', svg)
if not match:
    exit(1)

path_str = match.group(1)

# Split by 'M' to get subpaths
# path_str starts with M, so split gives empty string first
subpaths = ['M' + p for p in path_str.split('M') if p.strip()]

filtered_subpaths = []
for p in subpaths:
    # Find all y coordinates. The format is roughly M x,y L x,y ... Z
    # We can just extract all numbers
    coords = re.findall(r'(\d+),(\d+)', p)
    if not coords:
        # maybe space separated: M x y L x y
        coords = re.findall(r'(\d+)\s+(\d+)', p)
        if not coords:
            # Let's just find all floats
            nums = re.findall(r'\d+\.?\d*', p)
            # Y coords are every second number if M x y L x y
            if len(nums) >= 2:
                y_coords = [float(nums[i]) for i in range(1, len(nums), 2)]
            else:
                y_coords = [0]
    else:
        y_coords = [float(y) for x, y in coords]
    
    # Check max Y. The image height is 1536.
    # The text is at the bottom, probably Y > 1300
    if y_coords:
        max_y = max(y_coords)
        if max_y < 1250:
            filtered_subpaths.append(p)

new_path = ' '.join(filtered_subpaths)

new_svg = svg.replace(path_str, new_path)

with open('public/assets/brand/h-mask.svg', 'w') as f:
    f.write(new_svg)

print("Filtered out text from SVG.")
