import React from "react";

/**
 * Blog Page:
 * - Displays a grid/list of blog post placeholders.
 * - Each post shows a title, short excerpt, and a "Read More" button.
 */
function Blog() {
  // Placeholder list of posts
  const posts = [
    {
      id: 1,
      title: "How to Spot Malicious Links",
      excerpt:
        "Learn the common tactics used by attackers to disguise harmful URLs...",
    },
    {
      id: 2,
      title: "Top 10 URL Scanning Tools",
      excerpt:
        "A quick overview of the most popular tools to keep your browsing safe...",
    },
    {
      id: 3,
      title: "Staying Safe on Public Wi-Fi",
      excerpt:
        "Public networks can be hotspots for cyber threats. Here’s how to stay protected...",
    },
  ];

  return (
    <div className="container" style={styles.blogContainer}>
      <h2>Blog</h2>
      <div style={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            {/* Placeholder for an image */}
            <div style={styles.postImage}></div>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <button className="btn">Read More</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  blogContainer: {
    margin: "2rem auto",
    textAlign: "center",
  },
  postsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1rem",
    marginTop: "2rem",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: "6px",
    padding: "1.5rem",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s ease-in-out",
  },
  postImage: {
    width: "100%",
    height: "150px",
    backgroundColor: "#eaeaea",
    marginBottom: "1rem",
    borderRadius: "4px",
  },
};

export default Blog;
