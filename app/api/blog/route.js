import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Blog from "@/models/blog";
import queryString from "query-string";

export async function GET(req) {
  await dbConnect();
  const searchParams = queryString.parseUrl(req.url).query;
  const { page } = searchParams || {};
  const pageSize = 2;

  try {
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const blogCount = await Blog.countDocuments({});
    const blogs = await Blog.find({})
      .populate("postedBy", "name email")
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 });
    return NextResponse.json({
      blogs,
      currentPage,
      totalPage: Math.ceil(blogCount / pageSize),
    });
  } catch (error) {
    return NextResponse.json({ err: error.message }, { status: 500 });
  }
}
