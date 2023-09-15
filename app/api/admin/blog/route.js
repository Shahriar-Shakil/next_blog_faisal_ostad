import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import slugify from "slugify";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  const _req = await req.json();
  await dbConnect();
  try {
    const { title, content, category, image } = _req;
    switch (true) {
      case !title:
        return NextResponse.json({ err: "Title is required" }, { status: 400 });
      case !content:
        return NextResponse.json(
          { err: "Content is required" },
          { status: 400 }
        );
      case !category:
        return NextResponse.json(
          { err: "Category is required" },
          { status: 400 }
        );
    }
    // check if blog already exist
    const existBlog = await Blog.findOne({
      slug: slugify(title.toLowerCase()),
    });
    if (existBlog) {
      return NextResponse.json({ err: "Blog already exist" }, { status: 400 });
    }
    // get current user id
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // createBlog
    if (token.user.role !== "admin") {
      return NextResponse.json({ err: "Not authorized " }, { status: 401 });
    }

    const blog = await Blog.create({
      title,
      content,
      category,
      image: image ? image : null,
      postedBy: token.user._id,
      slug: slugify(title),
    });
    return NextResponse.json({ blog }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ err: err.message }, { status: 500 });
  }
}
