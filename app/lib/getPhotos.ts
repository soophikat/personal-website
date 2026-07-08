import pool from "@/app/lib/db";

export async function getPhotos() {
    const { rows: photos } = await pool.query(`
        SELECT photos.*, array_agg(tags.name) FILTER (WHERE tags.name IS NOT NULL) as tags from photos
        LEFT JOIN photo_tags ON photos.id = photo_tags.photo_id
        LEFT JOIN tags ON photo_tags.tag_id = tags.id
        GROUP BY photos.id
        `)
    return photos;
}