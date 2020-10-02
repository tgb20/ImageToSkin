import cv2
import numpy as np
import sys
from os import path

if len(sys.argv) <= 2:
    print('You need to specify an image file and hex code (no #)')
    quit()

file_name = sys.argv[1]
hex = sys.argv[2]

if not path.exists('uploads/' + file_name):
    print('' + file_name + ' does not exist')
    quit()

base_image = cv2.imread('uploads/' + file_name)
b_channel, g_channel, r_channel = cv2.split(base_image)
alpha_channel = np.ones(b_channel.shape, dtype=b_channel.dtype) * 255

base_image = cv2.merge((b_channel, g_channel, r_channel, alpha_channel))

(h1, w1) = base_image.shape[:2]

r = 32 / float(h1)
dim = (int(w1 * r), 32)

fit_to_skin_height = cv2.resize(base_image, dim)

(_, w2) = fit_to_skin_height.shape[:2]

x1 = w2/2 - 8
x2 = w2/2 + 8

fit_to_skin_width = fit_to_skin_height[0:32, x1:x2]

# Grab components from skin
skin_head = fit_to_skin_width[0:8, 4:12]
skin_left_arm = fit_to_skin_width[8:20, 0:4]
skin_right_arm = fit_to_skin_width[8:20, 12:]
skin_body = fit_to_skin_width[8:20, 4:12]
skin_left_leg = fit_to_skin_width[20:, 4:8]
skin_right_leg = fit_to_skin_width[20:, 8:12]

# Generate a preview image
skin_preview = np.zeros((32, 16, 4), np.uint8)

skin_preview[0:8, 4:12] = skin_head
skin_preview[8:20, 0:4] = skin_left_arm
skin_preview[8:20, 12:] = skin_right_arm
skin_preview[8:20, 4:12] = skin_body
skin_preview[20:, 4:8] = skin_left_leg
skin_preview[20:, 8:12] = skin_right_leg

# Generate a preview of the skin
print('Saved preview as ' + 'skin_preview_' + file_name.split('.')[0] + '.png')
cv2.imwrite('skins/skin_preview_' + file_name.split('.')[0] + '.png', skin_preview)

skin_image = np.zeros((64, 64, 4), np.uint8)

# Draw image on front of skin
# (8, 8, 16, 16)
skin_image[8:16, 8:16] = skin_head
# (20, 20, 28, 32)
skin_image[20:32, 20:28] = skin_body
# (36, 52, 40, 64)
skin_image[52:64, 36:40] = skin_right_arm
# (44, 20, 48, 32)
skin_image[20:32, 44:48] = skin_left_arm
# (20, 52, 24, 64)
skin_image[52:64, 20:24] = skin_right_leg
# (4, 20, 8, 32)
skin_image[20:32, 4:8] = skin_left_leg

# Convert hex color for background to bgr
hlen = len(hex)
rgb = tuple(int(hex[i:i+hlen/3], 16) for i in range(0, hlen, hlen/3))

bgr = (rgb[2], rgb[1], rgb[0], 255)

# Draw rest of skin

# (8, 0, 16, 8)
cv2.rectangle(skin_image, (8, 0), (15, 7), bgr, -1)
# (16, 0, 24, 8)
cv2.rectangle(skin_image, (16, 0), (23, 7), bgr, -1)
# (0, 8, 8, 16)
cv2.rectangle(skin_image, (0, 8), (7, 15), bgr, -1)
# (16, 8, 24, 16)
cv2.rectangle(skin_image, (16, 8), (23, 15), bgr, -1)
# (24, 8, 32, 16)
cv2.rectangle(skin_image, (24, 8), (31, 15), bgr, -1)
# (4, 16, 8, 20)
cv2.rectangle(skin_image, (4, 16), (7, 19), bgr, -1)
# (8, 16, 12, 20)
cv2.rectangle(skin_image, (8, 16), (11, 19), bgr, -1)
# (0, 20, 4, 32)
cv2.rectangle(skin_image, (0, 20), (3, 31), bgr, -1)
# 8, 20, 12, 32)
cv2.rectangle(skin_image, (8, 20), (11, 31), bgr, -1)
# (12, 20, 16, 32)
cv2.rectangle(skin_image, (12, 20), (15, 31), bgr, -1)
# (20, 16, 28, 20)
cv2.rectangle(skin_image, (20, 16), (27, 19), bgr, -1)
# (28, 16, 36, 20)
cv2.rectangle(skin_image, (28, 16), (35, 19), bgr, -1)
# (16, 20, 20, 32)
cv2.rectangle(skin_image, (16, 20), (19, 31), bgr, -1)
# (28, 20, 32, 32)
cv2.rectangle(skin_image, (28, 20), (31, 31), bgr, -1)
# (32, 20, 40, 32)
cv2.rectangle(skin_image, (32, 20), (39, 31), bgr, -1)
# (44, 16, 48, 20)
cv2.rectangle(skin_image, (44, 16), (47, 19), bgr, -1)
# (48, 16, 52, 20)
cv2.rectangle(skin_image, (48, 16), (51, 19), bgr, -1)
# (40, 20, 44, 32)
cv2.rectangle(skin_image, (40, 20), (43, 31), bgr, -1)
# (48, 20, 52, 32)
cv2.rectangle(skin_image, (48, 20), (51, 31), bgr, -1)
# (52, 20, 56, 32)
cv2.rectangle(skin_image, (52, 20), (55, 31), bgr, -1)
# (20, 48, 24, 52)
cv2.rectangle(skin_image, (20, 48), (23, 51), bgr, -1)
# (24, 48, 28, 52)
cv2.rectangle(skin_image, (24, 48), (27, 51), bgr, -1)
# (16, 52, 20, 64)
cv2.rectangle(skin_image, (16, 52), (19, 63), bgr, -1)
# (24, 52, 28, 64)
cv2.rectangle(skin_image, (24, 52), (27, 63), bgr, -1)
# (28, 52, 32, 64)
cv2.rectangle(skin_image, (28, 52), (31, 63), bgr, -1)
# (36, 48, 40, 52)
cv2.rectangle(skin_image, (36, 48), (39, 51), bgr, -1)
# (40, 48, 44, 52)
cv2.rectangle(skin_image, (40, 48), (43, 51), bgr, -1)
# (32, 52, 36, 64)
cv2.rectangle(skin_image, (32, 52), (35, 63), bgr, -1)
# (40, 52, 44, 64)
cv2.rectangle(skin_image, (40, 52), (43, 63), bgr, -1)
# (44, 52, 48, 64)
cv2.rectangle(skin_image, (44, 52), (47, 63), bgr, -1)

# Output final skin
print('Saved skin as ' + 'skin_' + file_name.split('.')[0] + '.png')
cv2.imwrite('skins/skin_' + file_name.split('.')[0] + '.png', skin_image)