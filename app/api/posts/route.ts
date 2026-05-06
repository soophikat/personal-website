import db from '@/app/lib/db';

export async function GET() {
    const stmt = db.prepare('SELECT * FROM posts');
    const posts = stmt.all();

    return Response.json({ posts });
}

export async function POST(req: Request) {

    console.log(req.body);
    const body = await req.json();

    if (!body) {
        return Response.json({ error: 'missing content!'});
    }
    try {
        const stmt = db.prepare('INSERT INTO posts (title, content) VALUES (?, ?)');
        const info = stmt.run(body.title, body.content);
        return Response.json({ message: 'created!'});
    } catch (e) {
        return Response.json({ error: 'could not create!'});
    }
}