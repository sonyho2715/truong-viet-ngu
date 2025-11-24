# Image Upload Folders

This directory contains all uploaded images for the Vietnamese Language School website.

## Folder Structure

```
uploads/
├── logos/              - Organization logos (Công đoàn, TNTT)
├── classrooms/         - Classroom interior photos
├── class-photos/       - Class group photos (students + teacher)
├── hero/               - Hero section background images
├── announcements/      - Images for announcements
├── general/            - General purpose images
└── temp/               - Temporary uploads (cleared periodically)
```

## Usage Guidelines

### Image Requirements

**Logos:**
- Format: PNG with transparency preferred
- Size: 200x200px to 500x500px
- Keep file size under 500KB

**Classroom Photos:**
- Format: JPG or PNG
- Recommended size: 800x600px
- Keep file size under 1MB

**Class Photos:**
- Format: JPG or PNG
- Recommended size: 1200x800px (landscape) or 800x1000px (portrait)
- Keep file size under 2MB

**Hero Backgrounds:**
- Format: JPG (high quality)
- Recommended size: 1920x1080px
- Keep file size under 500KB (use compression)

## Admin Upload Process

When uploading through the admin dashboard:

1. Images are temporarily stored in `/temp`
2. After processing (resize, optimize), moved to appropriate folder
3. Filename is sanitized and given unique identifier
4. Database record is created with filepath

## File Naming Convention

```
{category}-{timestamp}-{random}.{ext}

Examples:
logo-1703251234567-a8f9d.png
classroom-1703251234568-b7e3c.jpg
class-photo-1703251234569-c6d2a.jpg
```

## Important Notes

- All filenames are lowercase
- Spaces are replaced with hyphens
- Special characters are removed
- Vietnamese diacritics are preserved in alt text, not filenames
- Old images are NOT automatically deleted (manual cleanup needed)

## Adding Images Manually

If you want to add images manually without using the admin interface:

1. Place images in the appropriate folder
2. Follow the naming convention above
3. Optionally, create database records through Prisma Studio or seed file

## Example Images to Add

### Logos (place in `/logos/`)
- `cong-doan-logo.png` - Left logo (Công đoàn)
- `tntt-logo.png` - Right logo (TNTT)

### Classrooms (place in `/classrooms/`)
- `classroom-mg-a.jpg` - Mẫu giáo A classroom
- `classroom-mg-b.jpg` - Mẫu giáo B classroom
- `classroom-mg-c.jpg` - Mẫu giáo C classroom
- `classroom-1.jpg` - Lớp 1 classroom
- `classroom-3.jpg` - Lớp 3 classroom

### Class Photos (place in `/class-photos/`)
- `class-mg-a-2024.jpg` - Mẫu giáo A class photo
- `class-mg-b-2024.jpg` - Mẫu giáo B class photo
- `class-mg-c-2024.jpg` - Mẫu giáo C class photo
- `class-1-2024.jpg` - Lớp 1 class photo
- `class-3-2024.jpg` - Lớp 3 class photo

### Hero (place in `/hero/`)
- `hero-background.jpg` - Main hero background

## Cleanup Tasks

Periodically:
- Clear `/temp` folder of old files (> 24 hours)
- Remove unused images from database
- Optimize large images (compress if > 1MB)
- Backup important images before major updates

---

**Last Updated:** 2025-11-22
