async function getBlogs(searchParams) {
  const urlParams = {
    page: searchParams.page || 1,
  };
  const searchQuery = new URLSearchParams(urlParams).toString();
  const response = await fetch(`${process.env.API}/blog?${searchParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    next: { revalidate: 1 },
  });
  if (!response.ok) {
    console.log("response", response);
    throw new Error("Failed to fetch");
  }
  const data = await response.json();
  return data;
}

export default async function Home({ searchParams }) {
  const data = await getBlogs(searchParams);
  return (
    <main>
      <h1>Home</h1>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </main>
  );
}
