import os
from PIL import Image

# Define images to process
image_paths = [
    r"dist\img\projects\centro_medico_doctor.png",
    r"dist\img\projects\movieshop.png",
    r"dist\img\projects\votacion_automatizada.png",
    r"dist\img\projects\sistema_facturacion.png"
]

target_size = (1920, 1080)

def resize_image(path):
    try:
        full_path = os.path.abspath(path)
        if not os.path.exists(full_path):
            print(f"File not found: {full_path}")
            return

        with Image.open(full_path) as img:
            print(f"Processing {path} - Original Size: {img.size}")
            
            # Calculate aspect ratios
            target_ratio = target_size[0] / target_size[1]
            img_ratio = img.width / img.height
            
            if img_ratio != target_ratio:
                # Need to crop first to match aspect ratio
                if img_ratio > target_ratio:
                    # Image is wider than target, crop width
                    new_width = int(img.height * target_ratio)
                    offset = (img.width - new_width) // 2
                    box = (offset, 0, offset + new_width, img.height)
                else:
                    # Image is taller than target, crop height (Current case: 1024x1024 -> need 16:9)
                    new_height = int(img.width / target_ratio)
                    offset = (img.height - new_height) // 2
                    box = (0, offset, img.width, offset + new_height)
                
                print(f"Cropping to: {box}")
                img = img.crop(box)
            
            # Resize
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Save
            img.save(full_path)
            print(f"Saved {path} as {target_size}")

    except Exception as e:
        print(f"Error processing {path}: {e}")

if __name__ == "__main__":
    for path in image_paths:
        resize_image(path)
