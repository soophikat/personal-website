import db from '@/app/lib/db';
import z from 'zod';

export async function GET() {
    return Response.json({ok: true}, {status: 200});
}

//export async function GET() {
//     try {
//         const posts = db.prepare(`
//             SELECT posts.*, GROUP_CONCAT(tags.name) as tags FROM posts
//             LEFT JOIN post_tags ON posts.id = post_tags.post_id
//             LEFT JOIN tags ON post_tags.tag_id = tags.id
//             GROUP BY posts.id
//             `).all();
    
//         return Response.json({
//             posts: posts.map((post: any) => ({
//                 ...post,
//                 tags: post.tags ? post.tags.split(",") : []
//             }))
//         });
//     } catch (e) {
//         console.error(e);
//         return Response.json({error: 'internal error!'}, {status: 500});
//     }
// }


// const insertPost = db.transaction((title: string, content: string, tags: string[]) => {
//     const post = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').run(title, content);
//     const postId = post.lastInsertRowid;

//     for (const tag of tags) {
//         db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)').run(tag);

//         const { id: tagId } = db.prepare('SELECT id FROM tags WHERE name = ?').get(tag) as {id: number};

//         db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)').run(postId, tagId);
//     }

//     return postId;

// });

// const postSchema = z.object({
//     title: z.string().min(3),
//     content: z.string().min(3),
//     tags: z.array(z.string().min(1))
// })

// export async function POST(req: Request) {
//     const body = await req.json();

//     const result = postSchema.safeParse(body);
//     if (!result.success) {
//         return Response.json({error: result.error.issues}, {status: 400});
//     }

//     try {
//         insertPost(body.title, body.content, body.tags);
//         return Response.json({ message: 'created!' }, { status: 201 });
//     } catch (e) {
//         console.error(e);
//         return Response.json({ error: 'could not create!'}, { status: 400 });
//     }
// }