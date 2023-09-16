import Blog from "@/models/blog";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await dbConnect();
  const { slug } = context.params || {};

  try {
    const blog = await Blog.findOne({ slug }).populate("postedBy", "name");
    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
